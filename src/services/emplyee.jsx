import { employeeApiClient } from "../app/apiClient";

const resp = {
  status: "Failed",
  message: "Error",
  result: {},
};

export async function createRequest(asset) {
  try {
    const response = await employeeApiClient.post("request", asset);
    return await response.data;
  } catch (error) {
    return resp;
  }
}

export async function fetchRequest() {
  try {
    const response = await employeeApiClient.get("request");
    return await response.data;
  } catch (error) {
    return resp;
  }
}

export async function deleteRequest(id) {
  try {
    const response = await employeeApiClient.delete(`/request/${id}`);
    return await response.data;
  } catch (error) {
    return resp;
  }
}
