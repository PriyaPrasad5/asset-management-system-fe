import React from "react";
import { Route, Routes } from "react-router";
import AuthLayout from "../layout/authLayout";
import MainLayout from "../layout/mainLayout";
import AssetList from "../pages/assetList";
import AddAssetForm from "../pages/createAsset";
import LoginPage from "../pages/login";
import RegisterPage from "../pages/register";
import Dashboard from "../pages/adminDashboard";
import AddRequestForm from "../pages/employee";
import RequestEmployeeList from "../pages/employeeDashoard";
import RequestList from "../pages/requestList";
import ManagerAssetList from "../pages/managerAssetList";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthLayout />}>
        <Route path="" element={<LoginPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>
      <Route path="/app" element={<MainLayout />}>
        <Route path="create-asset" element={<AddAssetForm />} />
        <Route path="asset-list" element={<AssetList />} />
        <Route path="asset-dashboard" element={<Dashboard />} />
        <Route path="create-request" element={<AddRequestForm />} />
        <Route path="employee-dashboard" element={<RequestEmployeeList />} />
        <Route path="request-list" element={<RequestList />} />
        <Route path="assets" element={<ManagerAssetList />} />
      </Route>
    </Routes>
  );
};

export default Router;
