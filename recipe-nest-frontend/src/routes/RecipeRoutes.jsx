import { Route, Routes } from "react-router"

import RecipesPage from "../pages/recipe-pages/RecipesPage";
import RecipeForm from "../pages/recipe-pages/RecipeForm";
import RecipeDetailPage from "../pages/recipe-pages/RecipeDetailPage";

function RecipeRoutes() {
  return (
	<Routes>
		<Route path="/recipes" element={<RecipesPage />} />
		<Route path="/recipes/create" element={<RecipeForm />} />
		<Route path="/recipes/:id" element={<RecipeDetailPage />} />
	</Routes>
  )
}

export default RecipeRoutes