import { BrowserRouter} from "react-router";
import NavBar from "./components/NavBar";
import AppRoute from "./routes/AppRoute";

function App() {

  return (
	<BrowserRouter>
		<NavBar />
		<AppRoute />
	</BrowserRouter>
  )
}

export default App
