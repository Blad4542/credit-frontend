import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "./InfoModal";
import { apiRequest, mapIdTypeToDisplay } from "../../utils/utils";
import headerImage from "../../assets/header-image.png";
import samlaLogo from "../../assets/samla-image.png";

interface Application {
  id: string;
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
  idDocumentBase64: string;
  selfieBase64: string;
}

const ApplicationsTable: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const recordsPerPage = 10; // Número de registros por página
  const navigate = useNavigate();

  // Fetch applications from the API
  const fetchApplications = async (page: number) => {
    try {
      setLoading(true);
      const response = await apiRequest(
        `/getApplications?page=${page}&limit=${recordsPerPage}`,
        "GET"
      );
      setApplications(response.data); // Datos para la página actual
      setTotalRecords(response.totalRecords); // Total de registros
    } catch (err: any) {
      setError(err.message || "Error desconocido.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications(currentPage); // Fetch data cada vez que cambia la página
  }, [currentPage]);

  const totalPages = Math.ceil(totalRecords / recordsPerPage);

  const closeModal = () => {
    setSelectedApplication(null);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          <p className="text-blue-500 text-lg font-semibold">
            Cargando datos, por favor espera...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return <p className="text-center mt-10 text-red-500">{error}</p>;
  }

  return (
    <div className="w-screen">
      {/* Header */}
      <header className="relative w-full h-[50px] sm:h-[60px]">
        <img
          src={headerImage}
          alt="Samla Header"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center ml-33">
          <img
            src={samlaLogo}
            alt="Samla Logo"
            className="w-[50px] sm:w-[70px] h-auto"
          />
        </div>
      </header>

      <div className="container mx-auto px-4 mt-6">
        <h1 className="text-2xl font-bold my-6 text-gray-800">
          Historial de registro
        </h1>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Crear registro
        </button>
        {/* Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table-auto w-full text-left border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 border-b text-[#667085] ">
                    Nombres y apellidos
                  </th>
                  <th className="px-6 py-3 border-b text-[#667085]">
                    Correo electrónico
                  </th>
                  <th className="px-6 py-3 border-b text-[#667085]">
                    Número telefónico
                  </th>
                  <th className="px-6 py-3 border-b text-[#667085]">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {applications.map((application, index) => (
                  <tr
                    key={application.id}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-6 py-4 text-black font-medium text-sm">
                      {application.firstName + " " + application.lastName}
                    </td>
                    <td className="px-6 py-4 text-sm font-normal text-[#667085]">
                      {application.email}
                    </td>
                    <td className="px-6 py-4 text-sm font-normal text-[#667085]">
                      {application.phoneNumber}
                    </td>
                    <td className="px-6 py-4 text-blue-500">
                      <button
                        className="hover:underline"
                        onClick={() => setSelectedApplication(application)}
                      >
                        Ver detalle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-end mt-6">
          <nav>
            <ul className="inline-flex space-x-1">
              <li>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={`px-4 py-2 border rounded-l-md hover:bg-gray-100 ${
                    currentPage === 1
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-white text-gray-600"
                  }`}
                  disabled={currentPage === 1}
                >
                  {"<"}
                </button>
              </li>
              {Array.from({ length: totalPages }).map((_, i) => (
                <li key={i}>
                  <button
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-4 py-2 border hover:bg-gray-100 ${
                      currentPage === i + 1
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-600"
                    }`}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={`px-4 py-2 border rounded-r-md hover:bg-gray-100 ${
                    currentPage === totalPages
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-white text-gray-600"
                  }`}
                  disabled={currentPage === totalPages}
                >
                  {">"}
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      {/* Modal */}
      <Modal isOpen={!!selectedApplication} onClose={closeModal} title="">
        {selectedApplication && (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="flex justify-center items-center bg-gray-100 w-full h-40 rounded-md">
                {selectedApplication.selfieBase64 ? (
                  <img
                    src={selectedApplication.selfieBase64}
                    alt="Selfie"
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <p className="text-gray-500">No disponible</p>
                )}
              </div>
              <div className="lg:col-span-2">
                <p className="text-xl font-bold text-gray-800 mb-2">
                  {`${selectedApplication.firstName} ${selectedApplication.lastName}`}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold">Correo electrónico</p>
                    <p className="text-gray-700">{selectedApplication.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Departamento</p>
                    <p className="text-gray-700">
                      {selectedApplication.department}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Número de teléfono</p>
                    <p className="text-gray-700">
                      {selectedApplication.phoneNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Municipio</p>
                    <p className="text-gray-700">
                      {selectedApplication.municipality}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Tipo de documento</p>
                    <p className="text-gray-700">
                      {mapIdTypeToDisplay(selectedApplication.idType)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Dirección</p>
                    <p className="text-gray-700">
                      {selectedApplication.address}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Número de documento</p>
                    <p className="text-gray-700">
                      {selectedApplication.idNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Ingresos mensuales</p>
                    <p className="text-gray-700">
                      {selectedApplication.monthlyIncome}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <hr className="border-t border-gray-300 my-6" />
            <h3 className="text-lg font-semibold mb-4">
              Documento de identidad
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {selectedApplication.idDocumentBase64 ? (
                <img
                  src={selectedApplication.idDocumentBase64}
                  alt="Documento"
                  className="w-full h-auto border rounded-md"
                />
              ) : (
                <div className="bg-gray-100 w-full h-40 flex items-center justify-center border rounded-md">
                  <p className="text-gray-500">No disponible</p>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ApplicationsTable;
