import axios from 'axios';
import qs from 'qs';

export const BASE_URL = process.env.NODE_ENV==="production"? `http://be.${window.location.hostname}/api/`:"http://localhost:8000/api/"
console.log("BASE_URL:", {BASE_URL})
const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })
})

export default axiosClient