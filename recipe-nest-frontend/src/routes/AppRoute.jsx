import { Route, Routes } from "react-router"

import HomePage from "../pages/HomePage";
import RecipesPage from "../pages/RecipesPage";
import ChefsPage from "../pages/ChefsPage";
import ContactPage from "../pages/ContactPage";

function AppRoute() {
  return (
	<Routes>
		<Route path="/" element={<HomePage />} />
		<Route path="/recipes" element={<RecipesPage />} />
		<Route path="/chefs" element={<ChefsPage />} />
		<Route path="/contact" element={<ContactPage />} />
	</Routes>
  )
}

export default AppRoute