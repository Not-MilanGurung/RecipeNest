import { BrowserRouter} from "react-router";
import AppRoute from "./routes/AppRoute";
import { useEffect, useState } from "react";
import { UserContext } from "./helpers/contexts";
import api from "./helpers/api";


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
		<UserContext value={userContextVal}>
			<BrowserRouter>
				<AppRoute />
			</BrowserRouter>
		</UserContext>
	)
}

export default App;
