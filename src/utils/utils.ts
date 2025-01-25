import axios from "axios";

export const getIdPlaceholder = (idType: string): string => {
  switch (idType) {
    case "physical":
      return "1-2345-6789";
    case "legal":
      return "3-101-45678";
    case "passport":
      return "1-2345-6789";
    default:
      return "Selecciona un tipo de identificación";
  }
};

// Crear instancia de Axios con configuración base
export const axiosInstance = axios.create({
  baseURL: "https://credit-backend.netlify.app/api", // Cambia según tu URL base
  headers: {
    "Content-Type": "application/json",
  },
});

// Función genérica para hacer peticiones
export const apiRequest = async <T>(
  endpoint: any,
  method = "GET",
  data: T | null = null, // Cambiar 'null | undefined' a 'T | null'
  customHeaders = {}
) => {
  try {
    const response = await axiosInstance({
      url: endpoint,
      method,
      data, // Se incluye automáticamente si el método es POST, PUT, etc.
      headers: {
        ...customHeaders, // Combina headers adicionales
      },
    });

    return response.data; // Devuelve solo los datos
  } catch (error: any) {
    // Manejo de errores
    if (error.response) {
      // Respuesta del servidor con un error
      throw new Error(error.response.data.error || "Error en la solicitud");
    } else if (error.request) {
      // No se recibió respuesta del servidor
      throw new Error("No se pudo conectar con el servidor");
    } else {
      // Otro error (problema de configuración, etc.)
      throw new Error(error.message);
    }
  }
};

export const uploadToCloudinary = async (file: File, folder: string) => {
  const cloudName = "pendev"; // Reemplaza con tu Cloudinary Cloud Name
  const uploadPreset = "CreditApp"; // Reemplaza con tu Upload Preset

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", folder); // Opcional: especifica una carpeta

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData
    );
    return response.data.secure_url; // Devuelve la URL de la imagen
  } catch (error) {
    console.error("Error al subir la imagen a Cloudinary:", error);
    throw new Error("No se pudo subir la imagen. Inténtalo de nuevo.");
  }
};

type Cantons = {
  [province: string]: {
    [canton: string]: string[];
  };
};

export const provincesAndCantons: Cantons = {
  "San José": {
    Central: ["Carmen", "Merced", "Hospital", "Catedral", "Zapote"],
    Escazú: ["Escazú", "San Antonio", "San Rafael"],
    Desamparados: [
      "Desamparados",
      "San Rafael Abajo",
      "San Rafael Arriba",
      "San Juan de Dios",
      "San Miguel",
    ],
    Puriscal: [
      "Santiago",
      "Mercedes Sur",
      "Barbacoas",
      "Grifo Alto",
      "San Rafael",
    ],
    Tarrazú: ["San Marcos", "San Lorenzo", "San Carlos"],
  },
  Alajuela: {
    Central: ["Alajuela", "San José", "Carrizal", "San Antonio", "Guácima"],
    "San Ramón": [
      "San Ramón",
      "Santiago",
      "San Juan",
      "Piedades Norte",
      "Piedades Sur",
    ],
    Grecia: ["Grecia", "San Isidro", "San José", "San Roque", "Tacares"],
    "San Mateo": [
      "San Mateo",
      "Desmonte",
      "Jesús María",
      "Labrador",
      "Coyolar",
    ],
    Atenas: ["Atenas", "Jesús", "Mercedes", "San Isidro", "Escobal"],
  },
  Cartago: {
    Central: ["Oriental", "Occidental", "Carmen", "San Nicolás", "Guadalupe"],
    Paraíso: ["Paraíso", "Santiago", "Orosi", "Cachí", "Birrisito"],
    "La Unión": [
      "Tres Ríos",
      "San Diego",
      "San Juan",
      "Concepción",
      "Dulce Nombre",
    ],
    Jiménez: ["Juan Viñas", "Tucurrique", "Pejibaye"],
    Turrialba: ["Turrialba", "La Suiza", "Peralta", "Santa Cruz", "Chirripó"],
  },
  Heredia: {
    Central: ["Heredia", "Mercedes", "San Francisco", "Ulloa", "Varablanca"],
    Barva: ["Barva", "San Pedro", "San Pablo", "San Roque", "Santa Lucía"],
    "Santo Domingo": [
      "Santo Domingo",
      "San Vicente",
      "San Miguel",
      "Paracito",
      "Tures",
    ],
    "Santa Bárbara": [
      "Santa Bárbara",
      "San Pedro",
      "San Juan",
      "Jesús",
      "Santo Domingo",
    ],
    "San Rafael": [
      "San Rafael",
      "San Josecito",
      "Santiago",
      "Angeles",
      "Concepción",
    ],
  },
  Guanacaste: {
    Liberia: ["Liberia", "Cañas Dulces", "Mayorga", "Nacascolo", "Curubandé"],
    Nicoya: ["Nicoya", "Mansión", "San Antonio", "Quebrada Honda", "Sámara"],
    "Santa Cruz": [
      "Santa Cruz",
      "Bolsón",
      "Veintisiete de Abril",
      "Tempate",
      "Cartagena",
    ],
    Bagaces: ["Bagaces", "La Fortuna", "Mogote", "Río Naranjo"],
    Carrillo: ["Filadelfia", "Palmira", "Sardinal", "Belén"],
  },
  Puntarenas: {
    Central: [
      "Puntarenas",
      "Chacarita",
      "Barranca",
      "Monteverde",
      "Isla del Coco",
    ],
    Esparza: [
      "Espíritu Santo",
      "San Juan Grande",
      "Macacona",
      "San Rafael",
      "San Jerónimo",
    ],
    "Buenos Aires": [
      "Buenos Aires",
      "Volcán",
      "Potrero Grande",
      "Boruca",
      "Pilas",
    ],
    "Montes de Oro": ["Miramar", "La Unión", "San Isidro"],
    Osa: [
      "Puerto Cortés",
      "Palmar",
      "Sierpe",
      "Bahía Ballena",
      "Piedras Blancas",
    ],
  },
  Limón: {
    Central: [
      "Limón",
      "Valle La Estrella",
      "Río Blanco",
      "Matama",
      "Cieneguita",
    ],
    Pococí: ["Guápiles", "Jiménez", "La Rita", "Roxana", "Cariari"],
    Siquirres: ["Siquirres", "Pacuarito", "Florida", "Germania", "Cairo"],
    Talamanca: ["Bratsi", "Sixaola", "Cahuita", "Telire"],
    Matina: ["Matina", "Bataán", "Carrandí"],
  },
};
