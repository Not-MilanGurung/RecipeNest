import { Route, Routes } from "react-router";

// Swagger
import SwaggerUI from "swagger-ui-react";
import { BACKEND_API_URL } from "../helpers/constants";
import "swagger-ui-react/swagger-ui.css";

import { HomePage, ContactPage, LoginPage, RegisterPage, ProfilePage, ForgotPasswordPage} from '../pages/comman-pages';
import ChefsPage from "../pages/chef-pages/ChefsPage";

// Recipe Pages
import { RecipesPage, RecipeForm, RecipeDetailPage } from "../pages/recipe-pages";

import AdminRoute from "./AdminRoutes";
import { AdminDashboard, AdminLoginPage } from "../pages/admin-pages";

function AppRoute() {
  return (
    <Routes>
      <Route path="/">
        <Route path="" element={<HomePage />} />
        <Route path="chefs/:id" element={<ChefsPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot" element={<ForgotPasswordPage />} />
        <Route path="profile" element={<ProfilePage />} />

        <Route path="recipes">
          <Route path="" element={<RecipesPage />} />
          <Route path="create" element={<RecipeForm />} />
          <Route path=":id" element={<RecipeDetailPage />} />
        </Route>

        <Route
          path="api-docs"
          element={<SwaggerUI url={`${BACKEND_API_URL}/api-docs.json`} />}
        />
        <Route path="admin/login" element={<AdminLoginPage />} />
        <Route path="admin" element={<AdminRoute />}>
          <Route path="dashboard" element={<AdminDashboard />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRoute;
