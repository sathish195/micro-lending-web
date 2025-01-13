import axios from "axios";
import helpers from "./crypto";
import http from "./httpService";

const apiEndpoint = process.env.REACT_APP_API_URL;

export async function backEndCall(route) {
  const { data } = await http.post(apiEndpoint + route);

  return helpers.decryptobj(data);
}

export async function backEndCallFile(route, requestBody, requestOptions) {
  try {
    const response = await http.post(apiEndpoint + route, requestBody, requestOptions);
    console.log(response);
    return response;
  } catch (error) {
    console.error("Error fetching file:", error);
    throw error;
  }
}

export async function backEndCallObj(route, obj) {
  console.log(obj, "payload");
  const drreqpob = await helpers.encryptobj(obj);

  const { data } = await http.post(apiEndpoint + route, {
    enc: drreqpob,
  });
  return helpers.decryptobj(data);
}
