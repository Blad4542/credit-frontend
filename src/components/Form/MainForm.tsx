import React, { useState } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import { apiRequest } from "../../utils/utils";

interface ApplicationPayload {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  idType: string;
  idNumber: string;
  department: string;
  municipality: string;
  address: string;
  monthlyIncome: number;
  idDocumentBase64: string;
  selfieBase64: string;
}

const MainForm: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    idType: "",
    idNumber: "",
    department: "",
    municipality: "",
    address: "",
    monthlyIncome: "",
    document: "", // Documento de Step2
    selfie: "", // Selfie de Step3
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [apiMessage, setApiMessage] = useState<string | null>(null); // Mensaje de éxito o error

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUpload = (base64File: any) => {
    setFormData((prev) => ({
      ...prev,
      document: base64File, // Guardar en base64
    }));
  };

  const setPhoneNumber = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      phoneNumber: value,
    }));
  };

  const handleSelfieCapture = (selfieData: string) => {
    setFormData((prev) => ({
      ...prev,
      selfie: selfieData,
    }));
  };

  const nextStep = () => {
    if (currentStep === 2) {
      console.log("Datos guardados de Step1:", formData); // Verificar el estado
    }
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleCancel = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      idType: "",
      idNumber: "",
      department: "",
      municipality: "",
      address: "",
      monthlyIncome: "",
      document: "",
      selfie: "",
    });
    setCurrentStep(1);
  };

  const handlePhotoValidation = (isValid: boolean) => {
    if (isValid) {
      console.log("La foto es válida.");
    } else {
      console.log("La foto no es válida.");
    }
  };

  const handleSubmit = async () => {
    setApiMessage(null); // Resetea el mensaje

    // Ajustar los datos al formato esperado por la base de datos
    const payload: ApplicationPayload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      idType: formData.idType,
      idNumber: formData.idNumber,
      department: formData.department,
      municipality: formData.municipality,
      address: formData.address,
      monthlyIncome: Number(formData.monthlyIncome), // Convertir a número
      idDocumentBase64: formData.document, // Clave esperada para el documento
      selfieBase64: formData.selfie, // Clave esperada para el selfie
    };

    try {
      console.log("Enviando datos al API:", payload);

      // Llamada al API usando apiRequest
      const response = await apiRequest("/createApplication", "POST", payload);

      console.log("Respuesta del API:", response);

      setApiMessage("Solicitud realizada con éxito.");
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      setApiMessage(
        "Hubo un error al realizar la solicitud. Intenta nuevamente."
      );
    }
  };

  return (
    <div className="relative h-screen w-screen bg-gray-100">
      {/* Botón de atrás */}
      {currentStep > 1 && (
        <button
          onClick={prevStep}
          className="absolute top-4 left-4 bg-gray-200 p-2 rounded-full hover:bg-gray-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-800"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}
      {/* Mensaje de éxito o error */}
      {apiMessage && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-md shadow-md text-center">
          <p
            className={`text-lg ${
              apiMessage.includes("éxito") ? "text-green-600" : "text-red-600"
            }`}
          >
            {apiMessage}
          </p>
        </div>
      )}

      {/* Pasos del formulario */}
      <div className="h-full flex items-center justify-center">
        {currentStep === 1 && (
          <Step1
            formData={formData}
            handleInputChange={handleInputChange}
            setPhoneNumber={setPhoneNumber}
            nextStep={nextStep}
          />
        )}
        {currentStep === 2 && (
          <Step2
            formData={formData}
            handleInputChange={handleInputChange}
            handleFileUpload={handleFileUpload}
            handleCancel={handleCancel}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )}
        {currentStep === 3 && (
          <Step3
            handlePhotoValidation={handlePhotoValidation}
            handleSelfieCapture={handleSelfieCapture}
            handleSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default MainForm;
