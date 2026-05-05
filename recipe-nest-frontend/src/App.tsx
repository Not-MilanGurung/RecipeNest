import { BrowserRouter } from "react-router";
import AppRoute from "./routes/AppRoute";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserContext } from "./helpers/contexts";
import type { UserContextData, UserContextType } from "./helpers/contexts";
import {refreshToken} from "./helpers/api";

const queryClient = new QueryClient();

function App() {
  const [user, setUser] = useState<UserContextData | null>(null);
  const [userIsLoading, setUserIsLoading] = useState(true);
  const userContextVal: UserContextType = {
    data: user,
    setData: setUser,
    isLoading: userIsLoading,
    setIsLoading: setUserIsLoading,
  };

  useEffect(() => {
    refreshToken()
      .then((userData) => {
        setUser(userData);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setUserIsLoading(false);
      });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <UserContext value={userContextVal}>
        <BrowserRouter>
          <AppRoute />
        </BrowserRouter>
      </UserContext>
    </QueryClientProvider>
  );
}

export default App;
