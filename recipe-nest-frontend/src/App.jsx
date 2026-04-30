import { BrowserRouter, Routes} from "react-router";
import AppRoute from "./routes/AppRoute";
import { useEffect, useState } from "react";
import { UserContext } from "./helpers/contexts";
import api from "./helpers/api";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AdminRoutes from "./routes/AdminRoutes";

const queryClient = new QueryClient();

function App() {
	const [user, setUser] = useState({
		user: null,
		accessToken: null
	});
	const [userIsLoading, setUserIsLoading] = useState(true);
	const userContextVal = {data: user, setData:setUser, isLoading: userIsLoading};

	useEffect(() => {
			api.get('/users/refresh')
			.then((response) => {
				const newData = response.data.data;
				setUser({ user: newData.user, accessToken: newData.accessToken });
				setUserIsLoading(false);
			}).catch((error) => {
				console.error('Error refreshing token');
				console.error(error);
				setUserIsLoading(false);
			});
	}, []);

	return (
		<QueryClientProvider client={queryClient}>
			<UserContext value={userContextVal}>
				<BrowserRouter>
							<AppRoute />
							<AdminRoutes />
				</BrowserRouter>
			</UserContext>
		</QueryClientProvider>
	)
}

export default App;
