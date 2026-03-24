import api from './api'; // Import the basic axios instance
import { useEffect, useContext } from 'react';
import { UserContext } from './contexts';

const useAxiosPrivate = () => {
    const { data, setData } = useContext(UserContext);

    useEffect(() => {
        // Request Interceptor
        const requestIntercept = api.interceptors.request.use(
            (config) => {
                if (!config.headers['Authorization'] && data?.accessToken) {
                    config.headers['Authorization'] = `Bearer ${data.accessToken}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response Interceptor
        const responseIntercept = api.interceptors.response.use(
            (response) => response,
            async (error) => {
                const prevRequest = error?.config;

                if (error?.response?.status === 401 && !prevRequest?.sent) {
                    prevRequest.sent = true;

                    try {
                        // Refresh the token
                        const response = await api.get('/users/refresh');
                        const newAccessToken = response.data.data.accessToken;

                        // UPDATE CONTEXT: Crucial step
                        setData(prev => ({ ...prev, accessToken: newAccessToken }));

                        // Retry with new token
                        prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                        return api(prevRequest);
                    } catch (refreshError) {
                        // If refresh fails (e.g., refresh token expired), log out user
                        setData(null);
                        return Promise.reject(refreshError);
                    }
                }
                return Promise.reject(error);
            }
        );

        // Cleanup: remove interceptors when component unmounts
        return () => {
            api.interceptors.request.eject(requestIntercept);
            api.interceptors.response.eject(responseIntercept);
        };
    }, [data, setData]);

    return api;
};

export default useAxiosPrivate;