import React, { useState, useEffect } from "react";
import { provincesAndCantons, uploadToCloudinary } from "../../utils/utils";
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
  nextStep,
}) => {
  const [cantons, setCantons] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string | null>(null);

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith("image/")) {
        setFileName(file.name);

        try {
          const cloudinaryUrl = await uploadToCloudinary(file, "CreditApp");

          handleFileUpload(cloudinaryUrl);

          // Limpiar mensaje de error al subir correctamente
          setErrors((prev) => ({ ...prev, document: "" }));
        } catch {
          setErrors((prev) => ({
            ...prev,
            document: "Error al subir la imagen.",
          }));
        }
      } else {
        setErrors((prev) => ({
          ...prev,
          document: "Por favor, suba únicamente archivos de imagen.",
        }));
      }
    }
  };

  const handleFileDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        setFileName(file.name);

        try {
          const cloudinaryUrl = await uploadToCloudinary(file, "CreditApp");

          handleFileUpload(cloudinaryUrl);

          // Limpiar mensaje de error al subir correctamente
          setErrors((prev) => ({ ...prev, document: "" }));
        } catch {
          setErrors((prev) => ({
            ...prev,
            document: "Error al subir la imagen.",
          }));
        }
      } else {
        setErrors((prev) => ({
          ...prev,
          document: "Por favor, suba únicamente archivos de imagen.",
        }));
      }
    }
  };

  const handleValidation = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.department) {
      newErrors.department = "La provincia es obligatoria.";
    }

    if (!formData.municipality) {
      newErrors.municipality = "El cantón es obligatorio.";
    }

    if (!formData.address) {
      newErrors.address = "El distrito es obligatorio.";
    }

    if (!formData.monthlyIncome || isNaN(Number(formData.monthlyIncome))) {
      newErrors.monthlyIncome = "Debe ingresar un ingreso mensual válido.";
    }

    if (!formData.document) {
      newErrors.document = "Debe subir un archivo.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (handleValidation()) {
      nextStep();
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen">
      <div className="w-full h-[34px]">
        <img
          src={headerImage}
          alt="Samla Header"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-col lg:flex-row lg:h-full h-auto items-center lg:items-start justify-center px-4 lg:px-16 lg:mt-[100px]">
        <div className="lg:w-1/2 w-full flex flex-col justify-center items-center lg:items-start p-4 lg:p-8 ">
          <img
            src={logoImage}
            alt="Samla Logo"
            className="w-20 h-auto mt-2 lg:mt-0 mb-4"
          />
          <h1 className="text-xl lg:text-2xl font-bold text-gray-800 mb-6 text-center lg:text-left">
            Datos de vivienda
          </h1>

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
            {errors.department && (
              <p className="text-sm text-red-500 mt-1">{errors.department}</p>
            )}
          </div>

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
            {errors.municipality && (
              <p className="text-sm text-red-500 mt-1">{errors.municipality}</p>
            )}
          </div>

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
            {errors.address && (
              <p className="text-sm text-red-500 mt-1">{errors.address}</p>
            )}
          </div>

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
              onChange={handleInputChange}
              placeholder="₡0.00"
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
            />
            {errors.monthlyIncome && (
              <p className="text-sm text-red-500 mt-1">
                {errors.monthlyIncome}
              </p>
            )}
          </div>
        </div>

        <div className="lg:w-1/2 w-full flex flex-col justify-center items-center p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 lg:mt-[40px] text-center ">
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
            {errors.document && (
              <p className="text-sm text-red-500 mt-2">{errors.document}</p>
            )}
            {fileName && (
              <p className="text-sm text-green-600 mt-2">
                Archivo cargado: {fileName}
              </p>
            )}
          </div>
          <div className="w-full flex justify-end space-x-4 px-8 py-4 mt-6 lg:mr-[50px]">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
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
