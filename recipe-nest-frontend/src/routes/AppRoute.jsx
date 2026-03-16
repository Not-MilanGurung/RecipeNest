import { Route, Routes } from "react-router"

import HomePage from "../pages/HomePage";
import RecipesPage from "../pages/RecipesPage";
import ChefsPage from "../pages/ChefsPage";
import ContactPage from "../pages/ContactPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";

function AppRoute() {
  return (
	<Routes>
		<Route path="/" element={<HomePage />} />
		<Route path="/recipes" element={<RecipesPage />} />
		<Route path="/chefs" element={<ChefsPage />} />
		<Route path="/contact" element={<ContactPage />} />
		<Route path="/login" element={<LoginPage />} />
		<Route path="/register" element={<RegisterPage />} />

	</Routes>
  )
}

export default AppRoute