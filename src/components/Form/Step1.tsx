import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import backgroundImage from "../../assets/image-step1.png";
import logoImage from "../../assets/logo.png";
import { getIdPlaceholder } from "../../utils/utils";

interface Step1Props {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    idType: string;
    idNumber: string;
  };
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  setPhoneNumber: (value: string) => void;
  nextStep: () => void;
}

const Step1: React.FC<Step1Props> = ({
  formData,
  handleInputChange,
  nextStep,
  setPhoneNumber,
}) => {
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    idNumber: "",
  });

  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.firstName.trim()) {
      newErrors.firstName = "El nombre es requerido.";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "El apellido es requerido.";
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Correo inválido.";
    }
    if (!formData.phoneNumber || !/^\d+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "El número de teléfono es inválido.";
    }
    if (!formData.idNumber || !/^\d+$/.test(formData.idNumber)) {
      newErrors.idNumber =
        "El número de identificación debe contener solo números.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      nextStep();
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-screen">
      <div className="lg:w-1/2 w-full h-full flex items-center justify-center bg-blue-600">
        <img
          src={backgroundImage}
          alt="Fondo del formulario"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="lg:w-1/2 w-full h-full flex items-center justify-center bg-white">
        <form
          className="w-full max-w-md flex flex-col justify-between h-[90%]"
          onSubmit={handleSubmit}
        >
          <div className="flex">
            <img
              src={logoImage}
              alt="Logo"
              className="w-32 h-auto object-contain mb-4"
            />
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-6">Registro</h1>
          <div className="space-y-4">
            {/* Campo: Nombres */}
            <div className="relative group">
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 group-focus-within:text-[#195DFA]"
              >
                Nombres
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Ingresar nombres"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-[#195DFA] focus:border-[#195DFA]"
              />
              {errors.firstName && (
                <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>
              )}
            </div>

            {/* Campo: Apellidos */}
            <div className="relative group">
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 group-focus-within:text-[#195DFA]"
              >
                Apellidos
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Ingresar apellidos"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-[#195DFA] focus:border-[#195DFA]"
              />
              {errors.lastName && (
                <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>
              )}
            </div>

            {/* Campo: Correo */}
            <div className="relative group">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 group-focus-within:text-[#195DFA]"
              >
                Correo
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="ejemplo@gmail.com"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-[#195DFA] focus:border-[#195DFA]"
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Campo: Número de Teléfono */}
            <div className="relative group">
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700 group-focus-within:text-[#195DFA]"
              >
                Número de Teléfono
              </label>
              <PhoneInput
                country={"cr"}
                value={formData.phoneNumber || ""}
                onChange={(value) => setPhoneNumber(value)}
                placeholder="(+506)"
                containerClass="react-tel-input w-full"
                inputClass="form-control w-full h-12 border border-gray-300 rounded-md focus:ring-[#195DFA] focus:border-[#195DFA]"
                buttonClass="flag-dropdown"
              />
              {errors.phoneNumber && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.phoneNumber}
                </p>
              )}
            </div>

            {/* Campo: Tipo de Identificación */}
            <div className="relative group">
              <label
                htmlFor="idType"
                className="block text-sm font-medium text-gray-700 group-focus-within:text-[#195DFA]"
              >
                Tipo de identificación
              </label>
              <select
                id="idType"
                name="idType"
                value={formData.idType}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-[#195DFA] focus:border-[#195DFA]"
                required
              >
                <option value="" disabled>
                  Seleccionar
                </option>
                <option value="physical">Física</option>
                <option value="legal">Jurídica</option>
                <option value="passport">Pasaporte</option>
              </select>
            </div>

            {/* Campo: Número de Identificación */}
            <div className="relative group">
              <label
                htmlFor="idNumber"
                className="block text-sm font-medium text-gray-700 group-focus-within:text-[#195DFA]"
              >
                Número de identificación
              </label>
              <input
                type="text"
                id="idNumber"
                name="idNumber"
                value={formData.idNumber}
                onChange={handleInputChange}
                placeholder={getIdPlaceholder(formData.idType)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-[#195DFA] focus:border-[#195DFA]"
              />
              {errors.idNumber && (
                <p className="text-sm text-red-500 mt-1">{errors.idNumber}</p>
              )}
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-[#FF5C00] text-white font-semibold rounded-md hover:bg-[#e55300] focus:ring-2 focus:ring-[#FF5C00] focus:ring-opacity-50 mt-4"
          >
            Continuar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Step1;
