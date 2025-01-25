import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom"; // Importar useNavigate
import * as faceapi from "face-api.js";
import headerImage from "../../assets/header-image.png"; // Imagen del header
import logoImage from "../../assets/logo.png"; // Logo
import cameraIcon from "../../assets/selfie-camera.png"; // Icono de la cámara
import Modal from "../CreditApplications/InfoModal";

interface Step3Props {
  handlePhotoValidation: (isValid: boolean) => void;
  handleSelfieCapture: (selfieData: string) => void;
  handleSubmit: () => void; // Llamar a la función de envío al cerrar el modal
  errorMessage: string | null; // Mensaje de error recibido desde MainForm
}

const Step3: React.FC<Step3Props> = ({
  handlePhotoValidation,
  handleSelfieCapture,
  handleSubmit,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [loadingModels, setLoadingModels] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate(); // Inicializa el hook para redirección

  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = "/models";
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        setLoadingModels(false);
      } catch (error) {
        setErrorMessage(
          "Error al cargar los modelos. Intenta recargar la página."
        );
        setLoadingModels(false);
      }
    };
    loadModels();

    // Limpieza para detener la cámara al desmontar el componente
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setErrorMessage(null);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorMessage("Tu navegador no soporta acceso a la cámara.");
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
      setErrorMessage("Error al acceder a la cámara.");
    }
  };

  const capturePhoto = async () => {
    setErrorMessage(null);
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
        handlePhotoValidation(true);
        setTimeout(() => {
          setIsAnalyzing(false);
        }, 2000);
      } else {
        setErrorMessage("No se detectó un rostro. Intenta de nuevo.");
        setIsAnalyzing(false);
      }
    } catch {
      setErrorMessage("Error al procesar la foto. Intenta de nuevo.");
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

  const handleFinalize = async () => {
    if (isAnalyzing) return; // Prevenir ejecución durante el análisis

    stopCamera(); // Detiene la cámara
    setIsAnalyzing(true); // Indica que el proceso está en curso

    try {
      const isSuccess = await handleSubmit(); // Llama al método handleSubmit del MainForm
      setIsModalOpen(true); // Abre el modal en cualquier caso
      if (!isSuccess) {
        setErrorMessage(
          "Ya existe un registro con estos datos. Intenta nuevamente."
        );
      }
    } catch (error) {
      setErrorMessage(
        "Hubo un error al realizar la solicitud. Intenta nuevamente."
      );
      setIsModalOpen(true); // Asegura que el modal se abra también en caso de error
    } finally {
      setIsAnalyzing(false); // Detiene el estado de análisis
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    handleSubmit(); // Llama a la función de envío
    navigate("/applications"); // Redirige a /applications
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-white">
      {/* Header */}
      <div className="w-full h-[34px] bg-gray-100">
        <img
          src={headerImage}
          alt="Samla Header"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col items-center justify-start px-4 overflow-y-auto">
        {/* Logo */}
        <img
          src={logoImage}
          alt="Samla Logo"
          className="w-24 h-auto mt-4 mb-6"
        />

        {/* Icono de cámara */}
        <div className="mb-8">
          <img
            src={cameraIcon}
            alt="Camera Icon"
            className="w-20 h-20 object-contain mb-4"
          />
        </div>

        {/* Mensaje principal */}
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">
          ¡Es hora de la selfie!
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Sonríe y asegúrate de tener buena iluminación.
        </p>

        {/* Cámara y acciones */}
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

        {/* Error */}
        {errorMessage && (
          <p className="text-red-500 text-sm mt-4">{errorMessage}</p>
        )}

        {/* Botones */}
        <div className="flex flex-col items-center mt-6 gap-4">
          <button
            onClick={capturePhoto}
            className="px-6 py-2 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600"
            disabled={!isCameraReady || loadingModels}
          >
            Capturar foto
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

        {/* Modal de análisis */}
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

        {/* Foto capturada */}
        {photo && (
          <>
            <div className="mt-6">
              <h2 className="text-lg font-bold text-gray-800 text-center mb-4">
                Foto capturada
              </h2>
              <img
                src={photo}
                alt="Foto capturada"
                className="w-64 h-auto rounded-md shadow-md"
              />
            </div>

            {/* Botón para finalizar */}
            <div className="mt-4">
              <button
                onClick={handleFinalize}
                className="px-6 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600"
              >
                Realizar Solicitud
              </button>
            </div>
          </>
        )}
      </div>

      {/* Modal de éxito */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={errorMessage ? "Error al enviar" : "¡Solicitud Exitosa!"}
        >
          <p className="text-gray-800 text-lg">
            {errorMessage || "Tu solicitud ha sido enviada exitosamente."}
          </p>
          <div className="mt-4 flex justify-end">
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
