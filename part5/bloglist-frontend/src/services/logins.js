import axios from "axios";

const baseUrl = "/api/login";
console.log(baseUrl,"base url from frontend");

const login = async (Credentials) => {
  const response = await axios.post(baseUrl, Credentials);
  return response.data;
}

export default { login };
