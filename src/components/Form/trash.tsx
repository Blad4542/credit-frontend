import React, { useState, useRef } from "react";

interface Step3Props {
  nextStep: () => void;
}

const Step3: React.FC<Step3Props> = ({ nextStep }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const openCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error("Error al acceder a la cámara:", error);
      alert(
        "No se pudo acceder a la cámara. Por favor, verifica los permisos."
      );
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.drawImage(
          videoRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        const imageData = canvasRef.current.toDataURL("image/png");
        setPhoto(imageData);
        stopCamera(); // Detener la cámara después de tomar la foto
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const handleContinue = () => {
    if (photo) {
      console.log("Foto capturada:", photo);
      nextStep();
    } else {
      alert("Por favor, toma una foto antes de continuar.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="w-full h-[34px] bg-blue-500" />
      <img src="/logo.png" alt="Logo" className="w-20 h-auto my-4" />
      <h1 className="text-2xl font-bold mb-4 text-center">
        ¡Es hora de la selfie!
      </h1>
      <p className="text-center text-gray-600 mb-6">
        Sonríe y asegúrate de tener buena iluminación.
      </p>

      {!photo ? (
        <div className="relative w-full max-w-md">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className={`w-full h-auto ${
              stream ? "block" : "hidden"
            } rounded-md`}
          />
          {!stream && (
            <button
              onClick={openCamera}
              className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
            >
              Abrir Cámara
            </button>
          )}
        </div>
      ) : (
        <div className="relative w-full max-w-md">
          <img
            src={photo}
            alt="Foto capturada"
            className="w-full h-auto rounded-md"
          />
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" width={640} height={480} />

      <div className="flex space-x-4 mt-6">
        {stream && (
          <button
            onClick={takePhoto}
            className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
          >
            Tomar Foto
          </button>
        )}
        {photo && (
          <button
            onClick={handleContinue}
            className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Continuar
          </button>
        )}
      </div>
    </div>
  );
};

export default Step3;
