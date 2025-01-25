import React, { useState } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUpload = (base64File: string) => {
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
    try {
      console.log("Enviando datos al API:", formData);

      // Aquí puedes realizar la petición al API con fetch o axios
      const response = await fetch("https://api.example.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Error al enviar los datos");
      }

      const result = await response.json();
      console.log("Respuesta del API:", result);
    } catch (error) {
      console.error("Error al enviar los datos:", error);
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
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )}
        {currentStep === 3 && (
          <Step3
            nextStep={handleSubmit}
            handlePhotoValidation={handlePhotoValidation}
            handleSelfieCapture={handleSelfieCapture}
          />
        )}
      </div>
    </div>
  );
};

export default MainForm;
