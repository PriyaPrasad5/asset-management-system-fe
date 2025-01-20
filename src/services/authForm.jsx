import { authApiClient } from "../app/apiClient";

const resp = {
  status: "Failed",
  message: "Error",
  result: {},
};

export async function userRegister(bData) {
  try {
    const response = await authApiClient.post("register", bData);
    return await response.data;
  } catch (error) {
    return resp;
  }
}

export async function userLogin(bData) {
  try {
    const response = await authApiClient.post("/login", bData);
    return await response.data;
  } catch (error) {
    return resp;
  }
}
