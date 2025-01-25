import React, { useState, useEffect } from "react";
import Modal from "./InfoModal";
import { apiRequest } from "../../utils/utils";

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
  documentPhotos?: string[];
}

const ApplicationsTable: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [paginatedApplications, setPaginatedApplications] = useState<
    Application[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const recordsPerPage = 15;

  // Fetch applications from the API
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await apiRequest("/getApplications", "GET");
      setApplications(response.data);
      setPaginatedApplications(response.data.slice(0, recordsPerPage));
    } catch (err: any) {
      setError(err.message || "Error desconocido.");
    } finally {
      setLoading(false);
    }
  };

  // Update paginated data whenever the page or applications change
  useEffect(() => {
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    setPaginatedApplications(applications.slice(startIndex, endIndex));
  }, [currentPage, applications]);

  useEffect(() => {
    fetchApplications();
  }, []);

  const totalPages = Math.ceil(applications.length / recordsPerPage);

  const closeModal = () => {
    setSelectedApplication(null);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Cargando datos...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-red-500">{error}</p>;
  }

  return (
    <div className="container mx-auto px-4">
      {/* Encabezado */}
      <header className="bg-blue-600 py-2 px-4">
        <h1 className="text-white text-lg font-semibold">Samla</h1>
      </header>

      {/* Título */}
      <h1 className="text-2xl font-bold my-6 text-gray-800">
        Historial de registro
      </h1>

      {/* Tabla */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="table-auto w-full text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 border-b text-gray-600">
                Nombres y apellidos
              </th>
              <th className="px-6 py-3 border-b text-gray-600">
                Correo electrónico
              </th>
              <th className="px-6 py-3 border-b text-gray-600">
                Número telefónico
              </th>
              <th className="px-6 py-3 border-b text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedApplications.map((application, index) => (
              <tr
                key={application.id}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-6 py-4 text-gray-800">
                  {application.firstName + " " + application.lastName}
                </td>
                <td className="px-6 py-4 text-gray-800">{application.email}</td>
                <td className="px-6 py-4 text-gray-800">
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

      {/* Paginación */}
      <div className="flex justify-center mt-6">
        <nav>
          <ul className="inline-flex space-x-1">
            <li>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-4 py-2 bg-white text-gray-600 border rounded-l-md hover:bg-gray-100"
                disabled={currentPage === 1}
              >
                {"<"}
              </button>
            </li>
            {Array.from({ length: totalPages }).map((_, i) => (
              <li key={i}>
                <button
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-4 py-2 bg-white text-gray-600 border hover:bg-gray-100 ${
                    currentPage === i + 1 ? "bg-blue-500 text-white" : ""
                  }`}
                >
                  {i + 1}
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-4 py-2 bg-white text-gray-600 border rounded-r-md hover:bg-gray-100"
                disabled={currentPage === totalPages}
              >
                {">"}
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Modal */}
      <Modal
        isOpen={!!selectedApplication}
        onClose={closeModal}
        title={`${selectedApplication?.firstName || ""} ${
          selectedApplication?.lastName || ""
        }`}
      >
        {selectedApplication && (
          <div>
            <div className="grid grid-cols-2 gap-4 mb-4">
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
                <p className="text-gray-700">{selectedApplication.idType}</p>
              </div>
              <div>
                <p className="text-sm font-semibold">Dirección</p>
                <p className="text-gray-700">{selectedApplication.address}</p>
              </div>
              <div>
                <p className="text-sm font-semibold">Número de documento</p>
                <p className="text-gray-700">{selectedApplication.idNumber}</p>
              </div>
              <div>
                <p className="text-sm font-semibold">Ingresos mensuales</p>
                <p className="text-gray-700">
                  {selectedApplication.monthlyIncome}
                </p>
              </div>
            </div>
            <h3 className="mt-6 text-lg font-semibold">
              Documento de identidad
            </h3>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {selectedApplication.documentPhotos?.length ? (
                selectedApplication.documentPhotos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`Document ${index + 1}`}
                    className="w-full h-auto border rounded-md"
                  />
                ))
              ) : (
                <p className="text-gray-500">No hay documentos disponibles</p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ApplicationsTable;
