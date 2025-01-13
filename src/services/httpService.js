import axios from "axios";
import logger from "./logService";


axios.interceptors.response.use(null, (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;
  if (!expectedError) {
    logger.log(error);
  }
  return Promise.reject(error);
});

function setJwt(jwt) {
    // console.log("set jwt", (jwt));
  axios.defaults.headers.common["Authorization"] = jwt;
  axios.defaults.headers.common["Content-type"] = "application/json";

}

function setExcelFileHeaders() {
    // console.log("set jwt", (jwt));
  axios.defaults.headers.common['Content - Type'] = 'application / json';
  axios.defaults.headers.common['Access - Control - Expose - Headers'] = 'Content - Disposition';

}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  setJwt,
  setExcelFileHeaders
};
