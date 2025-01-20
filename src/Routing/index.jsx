import React from "react";
import { Route, Routes } from "react-router";
import AuthLayout from "../layout/authLayout";
import MainLayout from "../layout/mainLayout";
import AssetList from "../pages/assetList";
import AddAssetForm from "../pages/createAsset";
import LoginPage from "../pages/login";
import RegisterPage from "../pages/register";

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
      </Route>
    </Routes>
  );
};

export default Router;
