import { managerApiClient } from "../app/apiClient";

const resp = {
  status: "Failed",
  message: "Error",
  result: {},
};

export async function fetchAssets() {
  try {
    const response = await managerApiClient.get("asset/list");
    return await response.data;
  } catch (error) {
    return resp;
  }
}

export async function filter(searchTerm) {
  try {
    const response = await managerApiClient.get(
      `/assets/warranty/date?date=${searchTerm}`
    );
    return await response.data;
  } catch (error) {
    return resp;
  }
}

export async function fetchRequest() {
  try {
    const response = await managerApiClient.get("requests");
    return await response.data;
  } catch (error) {
    return resp;
  }
}

export async function approveRequest(id, data) {
  try {
    const response = await managerApiClient.patch(
      `/request/${id.toString()}/approve`,
      data
    );
    return await response.data;
  } catch (error) {
    return resp;
  }
}

export async function rejectRequest(id, data) {
  try {
    const response = await managerApiClient.patch(
      `/request/${id.toString()}/reject`,
      data
    );
    return await response.data;
  } catch (error) {
    return resp;
  }
}

export async function fetchAssetStats() {
  try {
    const response = await managerApiClient.get(
      "assets/reports/asset-utilization"
    );
    return await response.data;
  } catch (error) {
    return resp;
  }
}
