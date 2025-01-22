import { adminApiClient } from "../app/apiClient";

const resp = {
  status: "Failed",
  message: "Error",
  result: {},
};

export async function createAsset(asset) {
  try {
    const response = await adminApiClient.post("assets", asset);
    return await response.data;
  } catch (error) {
    return resp;
  }
}

export async function fetchAssets() {
  try {
    const response = await adminApiClient.get("assets");
    return await response.data;
  } catch (error) {
    return resp;
  }
}

export async function filter(searchTerm) {
  try {
    const response = await adminApiClient.get(
      `/assets/warranty/date?date=${searchTerm}`
    );
    return await response.data;
  } catch (error) {
    return resp;
  }
}

export async function updateAsset(asset) {
  try {
    const response = await adminApiClient.patch(`/assets/${asset.id}`, asset);
    return await response.data;
  } catch (error) {
    return resp;
  }
}

export async function deleteAsset(id) {
  try {
    const response = await adminApiClient.delete(`/assets/${id}`);
    return await response.data;
  } catch (error) {
    return resp;
  }
}

export async function fetchAssetStats() {
  try {
    const response = await adminApiClient.get(
      "assets/reports/asset-utilization"
    );
    return await response.data;
  } catch (error) {
    return resp;
  }
}

export async function fetchUsers() {
  try {
    const response = await adminApiClient.get("/users");
    return await response.data;
  } catch (error) {
    return resp;
  }
}

export async function fetchUserDetails(userId) {
  try {
    const response = await adminApiClient.get(`/user/history/${userId}`);
    return await response.data;
  } catch (error) {
    return resp;
  }
}
