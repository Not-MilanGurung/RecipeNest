import { BrowserRouter, Routes} from "react-router";
import AppRoute from "./routes/AppRoute";
import { useEffect, useState } from "react";
import { UserContext } from "./helpers/contexts";
import api from "./helpers/api";
import RecipeRoutes from "./routes/RecipeRoutes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
	const [user, setUser] = useState({
		user: null,
		accessToken: null
	});
	const userContextVal = {data: user, setData:setUser};

	useEffect(() => {
			api.get('/users/refresh')
			.then((response) => {
				const newData = response.data.data;
				setUser({ user: newData.user, accessToken: newData.accessToken });
			}).catch((error) => {
				console.error('Error refreshing token');
				console.error(error);
				
			});
	}, []);

	return (
		<QueryClientProvider client={queryClient}>
			<UserContext value={userContextVal}>
				<BrowserRouter>
						<AppRoute />
						<RecipeRoutes />
				</BrowserRouter>
			</UserContext>
		</QueryClientProvider>
	)
}

export default App;
