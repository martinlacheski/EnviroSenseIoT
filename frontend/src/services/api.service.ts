import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
})

// Se utiliza los interceptores para pasar en el header el token y no utilizar en las peticiones HTTP
api.interceptors.request.use( config => {
    const token = localStorage.getItem('AUTH_TOKEN')
    if(token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Configuración global de Axios
api.interceptors.response.use(
    response => response,
    error => {
      // Aquí evitas loggear el error si es 400, pero lo rechazas para que lo maneje tu código
      if (error.response && error.response.status === 400) {
        return Promise.reject(error);
      }
      return Promise.reject(error);
    }
  );


export default api