import React, { useState, useEffect } from "react";
import { provincesAndCantons } from "../../utils/utils";
import uploadIcon from "../../assets/upload-icon.png"; // Icono para arrastrar
import logoImage from "../../assets/logo.png"; // Imagen del logo Samla
import headerImage from "../../assets/header-image.png"; // Imagen del header

interface Step2Props {
  formData: {
    department: string; // Provincia
    municipality: string; // Cantón
    address: string; // Distrito
    monthlyIncome: string;
    document: string;
  };
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  prevStep: () => void;
  nextStep: () => void;
  handleCancel: () => void;
  handleFileUpload: (file: File | string) => void;
}

const Step2: React.FC<Step2Props> = ({
  formData,
  handleInputChange,
  handleFileUpload,
  handleCancel,
  prevStep,
  nextStep,
}) => {
  const [cantons, setCantons] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [incomeError, setIncomeError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const initialCantons = Object.keys(provincesAndCantons["San José"]);
    const initialDistricts = provincesAndCantons["San José"][initialCantons[0]];

    setCantons(initialCantons);
    setDistricts(initialDistricts);

    handleInputChange({
      target: { name: "department", value: "San José" },
    } as React.ChangeEvent<HTMLSelectElement>);
    handleInputChange({
      target: { name: "municipality", value: initialCantons[0] },
    } as React.ChangeEvent<HTMLSelectElement>);
    handleInputChange({
      target: { name: "address", value: initialDistricts[0] },
    } as React.ChangeEvent<HTMLSelectElement>);
  }, []);

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const province = e.target.value;
    const newCantons = Object.keys(provincesAndCantons[province] || {});
    const newDistricts = provincesAndCantons[province]?.[newCantons[0]] || [];
    setCantons(newCantons);
    setDistricts(newDistricts);

    handleInputChange(e);
    handleInputChange({
      target: { name: "municipality", value: newCantons[0] },
    } as React.ChangeEvent<HTMLSelectElement>);
    handleInputChange({
      target: { name: "address", value: newDistricts[0] },
    } as React.ChangeEvent<HTMLSelectElement>);
  };

  const handleCantonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const canton = e.target.value;
    const newDistricts =
      provincesAndCantons[formData.department]?.[canton] || [];
    setDistricts(newDistricts);

    handleInputChange(e);
    handleInputChange({
      target: { name: "address", value: newDistricts[0] },
    } as React.ChangeEvent<HTMLSelectElement>);
  };

  const validateIncome = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!/^\d+(\.\d{1,2})?$/.test(value)) {
      setIncomeError("Por favor, ingrese un monto válido.");
    } else {
      setIncomeError(null);
    }
    handleInputChange(e);
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        handleFileUpload(file);
        setFileName(file.name);
        setErrorMessage(null);
      } else {
        setErrorMessage("Por favor, suba únicamente archivos de imagen.");
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          const base64String = reader.result as string;
          handleFileUpload(base64String); // Guardar la imagen como base64
        };
        reader.readAsDataURL(file);
        setFileName(file.name);
        setErrorMessage(null);
      } else {
        setErrorMessage("Por favor, suba únicamente archivos de imagen.");
      }
    } else {
      setErrorMessage("No se seleccionó ningún archivo.");
    }
  };

  useEffect(() => {
    if (formData.document) {
      // Usa un nombre predeterminado o algo relacionado con el momento de la carga
      setFileName("Documento cargado");
    } else {
      setFileName(null); // Resetea el nombre si no hay archivo
    }
  }, [formData.document]);

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-100">
      {/* Header con imagen */}
      <div className="w-full h-[34px]">
        <img
          src={headerImage}
          alt="Samla Header"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Contenedor principal */}
      <div className="flex flex-col lg:flex-row h-full items-center justify-center px-4 lg:px-16">
        {/* Columna izquierda */}
        <div className="lg:w-1/2 w-full flex flex-col justify-center items-center lg:items-start p-4 lg:p-8">
          <img
            src={logoImage}
            alt="Samla Logo"
            className="w-20 h-auto mt-4 lg:mt-0 mb-6"
          />
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center lg:text-left">
            Datos de vivienda
          </h1>

          {/* Provincia */}
          <div className="mb-4 relative group w-full">
            <label
              htmlFor="department"
              className="block text-sm font-medium text-gray-700"
            >
              Provincia
            </label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleProvinceChange}
              className="mt-1 block w-full p-3 pr-10 border border-gray-300 rounded-md"
            >
              {Object.keys(provincesAndCantons).map((province) => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
            </select>
          </div>

          {/* Cantón */}
          <div className="mb-4 relative group w-full">
            <label
              htmlFor="municipality"
              className="block text-sm font-medium text-gray-700"
            >
              Cantón
            </label>
            <select
              id="municipality"
              name="municipality"
              value={formData.municipality}
              onChange={handleCantonChange}
              className="mt-1 block w-full p-3 pr-10 border border-gray-300 rounded-md"
            >
              {cantons.map((canton) => (
                <option key={canton} value={canton}>
                  {canton}
                </option>
              ))}
            </select>
          </div>

          {/* Distrito */}
          <div className="mb-4 relative group w-full">
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Distrito
            </label>
            <select
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="mt-1 block w-full p-3 pr-10 border border-gray-300 rounded-md"
            >
              {districts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>

          {/* Ingresos Mensuales */}
          <div className="mb-4 relative group w-full">
            <label
              htmlFor="monthlyIncome"
              className="block text-sm font-medium text-gray-700"
            >
              Ingresos mensuales
            </label>
            <input
              type="text"
              id="monthlyIncome"
              name="monthlyIncome"
              value={formData.monthlyIncome}
              onChange={validateIncome}
              placeholder="₡0.00"
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
            />
            {incomeError && (
              <p className="text-sm text-red-500 mt-1">{incomeError}</p>
            )}
          </div>
        </div>

        {/* Columna derecha */}
        <div className="lg:w-1/2 w-full flex flex-col justify-center items-center p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center lg:mt-0">
            Fotografía de documento de identidad
          </h1>
          <div
            className={`w-full lg:w-[548px] max-w-lg h-auto lg:h-[330px] border-2 ${
              dragActive ? "border-blue-500" : "border-dashed border-[#1849D6]"
            } rounded-md p-6 flex flex-col items-center justify-center gap-3`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleFileDrop}
          >
            <img
              src={uploadIcon}
              alt="Upload icon"
              className="w-10 h-10 mb-4"
            />
            <p className="text-gray-600 text-lg">Arrastra aquí</p>
            <hr className="border-gray-300 w-full my-4" />
            <label
              htmlFor="document"
              className="cursor-pointer text-blue-500 underline hover:text-blue-600 text-lg"
            >
              Seleccionar archivo
            </label>
            <input
              type="file"
              id="document"
              name="document"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {errorMessage && (
              <p className="text-sm text-red-500 mt-2">{errorMessage}</p>
            )}
            {fileName && (
              <p className="text-sm text-green-600 mt-2">
                Archivo cargado: {fileName}
              </p>
            )}
          </div>
          {/* Botones debajo de la caja */}
          <div className="w-full flex justify-end space-x-4 px-8 py-4 mt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              onClick={nextStep}
              className="px-6 py-2 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600"
            >
              Continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2;
