import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as faceapi from "face-api.js";
import headerImage from "../../assets/header-image.png";
import logoImage from "../../assets/logo.png";
import cameraIcon from "../../assets/selfie-camera.png";
import Modal from "../CreditApplications/InfoModal";
import { apiRequest } from "../../utils/utils";

interface Step3Props {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    idType: string;
    idNumber: string;
    department: string;
    municipality: string;
    address: string;
    monthlyIncome: string;
    document: string;
    selfie: string;
  };
  handleSelfieCapture: (selfieData: string) => void;
  handleCancel: () => void;
}

const Step3: React.FC<Step3Props> = ({
  formData,
  handleSelfieCapture,
  handleCancel,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [loadingModels, setLoadingModels] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  const navigate = useNavigate();

  // Cargar modelos de face-api.js
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = "/models";
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        setLoadingModels(false);
      } catch {
        setModalMessage(
          "Error al cargar los modelos. Intenta recargar la página."
        );
        setIsModalOpen(true);
        setLoadingModels(false);
      }
    };
    loadModels();

    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setModalMessage("Tu navegador no soporta acceso a la cámara.");
      setIsModalOpen(true);
      return;
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = async () => {
          await videoRef.current?.play();
          setIsCameraReady(true);
        };
      }
    } catch {
      setModalMessage("Error al acceder a la cámara.");
      setIsModalOpen(true);
    }
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL("image/png");
    setPhoto(imageData);
    handleSelfieCapture(imageData); // Guardar la foto en base64
    setIsAnalyzing(true);

    try {
      const detections = await faceapi.detectAllFaces(
        canvas,
        new faceapi.TinyFaceDetectorOptions()
      );

      if (detections.length > 0) {
        setIsAnalyzing(false);
      } else {
        setModalMessage("No se detectó un rostro. Intenta de nuevo.");
        setIsModalOpen(true);
        setIsAnalyzing(false);
      }
    } catch {
      setModalMessage("Error al procesar la foto. Intenta de nuevo.");
      setIsModalOpen(true);
      setIsAnalyzing(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setIsCameraReady(false);
    }
  };

  const handleSubmit = async () => {
    setModalMessage(null);
    setIsSubmitting(true);

    const payload = {
      ...formData,
      monthlyIncome: Number(formData.monthlyIncome),
    };

    try {
      await apiRequest("/createApplication", "POST", payload);
      setModalMessage("¡Solicitud realizada con éxito!");
      setIsSuccess(true);
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        setModalMessage("Ya existe un registro con estos datos.");
        setIsSuccess(false);
      } else if (error.response && error.response.status === 500) {
        setModalMessage("Problemas con el servidor, intenta de nuevo.");
        setIsSuccess(false);
      } else {
        setModalMessage("Ya existe un registro con estos datos.");
        setIsSuccess(false);
      }
    } finally {
      setIsModalOpen(true);
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    if (isSuccess) {
      navigate("/applications");
      stopCamera();
    } else {
      navigate("/");
      stopCamera();
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-white">
      <div className="w-full h-[34px] bg-gray-100">
        <img
          src={headerImage}
          alt="Header"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 flex flex-col items-center justify-start px-4 overflow-y-auto">
        <img src={logoImage} alt="Logo" className="w-24 h-auto mt-4 mb-6" />
        <div className="mb-8">
          <img
            src={cameraIcon}
            alt="Camera Icon"
            className="w-20 h-20 object-contain mb-4"
          />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">
          ¡Es hora de la selfie!
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Sonríe y asegúrate de tener buena iluminación.
        </p>
        <div className="w-full max-w-lg flex flex-col items-center">
          {loadingModels ? (
            <p className="text-gray-600">Cargando modelos...</p>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className={`w-full max-w-lg h-64 rounded-md shadow-md bg-black ${
                  isCameraReady ? "block" : "hidden"
                }`}
              />
              <canvas ref={canvasRef} className="hidden" />
              {!isCameraReady && (
                <button
                  onClick={startCamera}
                  className="px-6 py-2 mt-6 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
                >
                  Activar cámara
                </button>
              )}
            </>
          )}
        </div>
        <div className="flex flex-col items-center mt-6 gap-4">
          <button
            onClick={capturePhoto}
            className="px-6 py-2 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600"
            disabled={!isCameraReady || loadingModels}
          >
            Capturar foto
          </button>
          <button
            onClick={handleCancel}
            className="px-6 py-2 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600"
          >
            Cancelar
          </button>
          {isCameraReady && (
            <button
              onClick={stopCamera}
              className="px-6 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600"
            >
              Detener cámara
            </button>
          )}
        </div>
        {isAnalyzing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
            <div className="bg-white p-6 rounded-md shadow-md text-center">
              <div className="loader mb-4"></div>
              <p className="text-lg font-semibold text-gray-800">
                Analizando foto...
              </p>
            </div>
          </div>
        )}
        {photo && (
          <>
            <div className="mt-6">
              <h2 className="text-lg font-bold text-gray-800 text-center mb-4">
                Foto capturada:
              </h2>
              <img
                src={photo}
                alt="Foto capturada"
                className="w-64 h-auto rounded-md shadow-md"
              />
            </div>
            <div className="mt-4">
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enviando..." : "Realizar Solicitud"}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={isSuccess ? "¡Éxito!" : "Error"}
        >
          <p className="text-gray-800 text-lg">{modalMessage}</p>
          <div className="flex justify-end mt-4">
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Aceptar
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Step3;
