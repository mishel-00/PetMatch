// Define la URL base de la API
// Obtiene los headers con el token desde ` AsyncStorage`
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

//export const API_URL = "http://192.168.18.117:3000"; //casa Garres
//export const API_URL = "http://192.168.100.69:3000"; //casa llano de brujas
//export const API_URL = "http://192.200.0.101:3000"; //CTICONTROL portatil
//export const API_URL = "http:// 192.168.10.171:3000"; //CTICONTROL torre
//export const API_URL = "http://192.168.10.171:3000"; //CTICONTROL portatil
export const API_URL = "https://8956-88-148-32-250.ngrok-free.app"; //casa Garres con https




const getHeaders = async () => {
  const token = await AsyncStorage.getItem("token"); // Obtiene el token almacenado
  const headers: any = {
    "Content-Type": "application/json",
    Accept: "application/json, text/plain, */*",
  };
  //Fix:En el login no tengo token por tanto si descomento esto me dara 
  //error en el login. Mirar como solucionar esto aposteriori.

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    headers,
  };
};




// AXIOS: Buen post de axios ****************************
export const post = async (path: string, data: unknown) => {
  console.log("PostData", data);
  console.log("path de post", `${API_URL}/${path}`);

  const headers = await getHeaders();
  const respuesta = await axios
    .post(`${API_URL}/${path}`, data, {
      headers: { ...headers },
      timeout: 10000,
      // No incluyas "Content-Type" aquí
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      if (error.code !== "ERR_NETWORK") {
        console.log("Axios Error Response POST:", error.response);
        throw new Error(JSON.stringify(error.response.data));
      } else {
        console.log("Axios Error POST CONEXION:", error);
        throw new Error(JSON.stringify(error));
      }
    });

  return respuesta;
};




// AXIOS: Buen get de axios ****************************
export const get = async (path: string, id?: number) => {

  const headers = await getHeaders();
  const urlRequest = id ? `${API_URL}/${path}/${id}` : `${API_URL}/${path}`;
  console.log("path", urlRequest);
  // const xdata = await axios.get(`${API_URL}/${path}`, {
  const xdata = await axios.get(urlRequest, {
    headers: { ...headers },
  }).then(({ data }) => {
    console.log('Axios Success Response GET:', data);
    return data
  }).catch((error) => {
    if (error.code !== 'ERR_NETWORK') {
      console.log('Axios Error Response GET:', error.response);
      throw new Error(error.response.data);
    } else {
      console.log('Axios Error GET CONEXION:', error);
      throw new Error(error);
    }
  });
  //   console.log(res);
  return xdata;

};



// Función para realizar peticiones POST
export const postxxx = async (path: string, data: unknown) => {
  try {
    const headers = await getHeaders(); // Espera los headers
    const response = await axios.post(`${API_URL}/${path}`, data, {
      headers, // Pasa los headers resueltos
    });
    // console.log("Axios POST Response:", response.data);
    return response.data;
  } catch (error) {
    handleError(error, "POST");
  }
};

// Función para realizar peticiones GET
export const getxxx = async (path: string, id?: number) => {
  try {
    const headers = await getHeaders(); // Espera los headers
    const url = id ? `${API_URL}/${path}/${id}` : `${API_URL}/${path}`;
    const response = await axios.get(url, { headers }); // Pasa los headers resueltos
    // console.log("Axios GET Response:", response.data);
    return response.data;
  } catch (error) {
    handleError(error, "GET");
  }
};

// Función para manejar errores
const handleError = (error: any, method: string) => {
  if (error.response) {
    console.log(`❌ Axios ${method} Error Response:`, error.response.data); // ✅ log más útil
    throw new Error(error.response.data.message || JSON.stringify(error.response.data));
  } else if (error.request) {
    console.log(`❌ Axios ${method} Error Request:`, error.request);
    throw new Error("No se recibió respuesta del servidor");
  } else {
    console.log(`❌ Axios ${method} Error:`, error.message);
    throw new Error("Error desconocido");
  }
};
export const deletexxx = async (path: string) => {
  try {
    const headers = await getHeaders();
    const response = await axios.delete(`${API_URL}/${path}`, { headers });
    return response.data;
  } catch (error) {
    handleError(error, "DELETE");
  }
};



export const registerUser = async (data: {
  nombre: string;
  email: string;
  password: string;
  telefono: string;
  direccion: string;
  rol: "adoptante" | "asociacion";
}) => {
  try {
    const response = await axios.post(`${API_URL}/api/registro`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    handleError(error, "POST");
  }


};

export const updateAnimal = async (id: string, data: Partial<any>) => {
  try {
    const headers = await getHeaders(); // usamos tu getHeaders de AsyncStorage
    const response = await axios.put(`${API_URL}/api/animal/${id}`, data, { headers });
    return response.data;
  } catch (error: any) {
    console.error("❌ Error al actualizar el animal:", error);
    throw new Error(error.response?.data?.error || "Error al actualizar animal");
  }
};

export const deleteAnimal = async (id: string) => {
  try {
    const headers = await getHeaders(); // o getHeaders() si usas eso
    const response = await axios.delete(`${API_URL}/api/animal/${id}`, {
      headers,
    });
    return response.data;
  } catch (error: any) {
    console.error("❌ Error al eliminar el animal:", error);
    throw new Error(error.response?.data?.error || "Error al eliminar animal");
  }


};

export const patchxxx = async (url: string, body: any) => {
  try {
    const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/${url}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText);
    }

    return await res.json();
  } catch (error) {
    throw error;
  }
};



