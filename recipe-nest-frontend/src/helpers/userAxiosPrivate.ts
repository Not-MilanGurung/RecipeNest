import api, {refreshToken} from "./api"; // Import the basic axios instance

import { useEffect, useContext } from "react";
import { UserContext } from "./contexts";

const useAxiosPrivate = () => {
  const { data, setData, setIsLoading } = useContext(UserContext);

  useEffect(() => {
    // Request Interceptor
    const requestIntercept = api.interceptors.request.use(
      (config) => {
        if (!data) {
          return config;
        }
        if (!config.headers["Authorization"] && data?.accessToken) {
          config.headers["Authorization"] = `Bearer ${data.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Response Interceptor
    const responseIntercept = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        console.log(data);
        if (!data) {
          return Promise.reject(error);
        }
        const prevRequest = error?.config;
        if (error?.response?.status === 401 && !prevRequest?.sent) {
          prevRequest.sent = true;

          try {
            // Refresh the token
            setIsLoading(true);
            const response = await refreshToken();
            setData(response)
            setIsLoading(false);
            return api(prevRequest);
          } catch (refreshError) {
            // If refresh fails (e.g., refresh token expired), log out user
            console.log("Logged out");
            setData(null);
            setIsLoading(false);
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      },
    );

    // Cleanup: remove interceptors when component unmounts
    return () => {
      api.interceptors.request.eject(requestIntercept);
      api.interceptors.response.eject(responseIntercept);
    };
  }, []);

  return api;
};

export default useAxiosPrivate;
