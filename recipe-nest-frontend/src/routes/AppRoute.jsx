import { Route, Routes } from "react-router"

// Swagger
import SwaggerUI from 'swagger-ui-react';
import { BACKEND_API_URL } from '../helpers/constants';
import 'swagger-ui-react/swagger-ui.css';

import HomePage from "../pages/HomePage";
import ChefsPage from "../pages/chef-pages/ChefsPage";
import ContactPage from "../pages/ContactPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ProfilePage from "../pages/comman-pages/ProfilePage";

// Recipe Pages
import RecipesPage from "../pages/recipe-pages/RecipesPage";
import RecipeForm from "../pages/recipe-pages/RecipeForm";
import RecipeDetailPage from "../pages/recipe-pages/RecipeDetailPage";

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

			<Route path="recipes" >
				<Route path="" element={<RecipesPage />} />
				<Route path="create" element={<RecipeForm />} />
				<Route path=":id" element={<RecipeDetailPage />} />
			</Route>

			<Route path="api-docs" element={<SwaggerUI url={`${BACKEND_API_URL}/api-docs.json`} />} />
		</Route>
	</Routes>
  )
}

export default AppRoute