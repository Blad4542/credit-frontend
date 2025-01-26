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
    document: "",
    selfie: "",
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [apiMessage, setApiMessage] = useState<string | null>(null);

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
      document: base64File,
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
    setApiMessage(null); // Limpia el mensaje API
  };

  return (
    <div className="relative h-screen w-screen bg-gray-100">
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
            formData={formData}
            handleSelfieCapture={handleSelfieCapture}
            handleCancel={handleCancel}
          />
        )}
      </div>
    </div>
  );
};

export default MainForm;
