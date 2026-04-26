import {useContext} from 'react'
import {Navigate, Route, Routes, useLocation, Outlet } from 'react-router'
import AdminLoginPage from '../pages/admin-pages/AdminLoginPage'
import AdminDashboard from '../pages/admin-pages/AdminDashboard'

import { UserContext } from "../helpers/contexts";

const AdminRoute = () => {
    const { data, isLoading } = useContext(UserContext);
    const location = useLocation();

    // Prevent redirecting while checking the refresh token/session
    if (isLoading) {
        return <div className="min-h-screen bg-secondary flex items-center justify-center italic">Authenticating Admin...</div>;
    }

    const user = data?.user;

    // Check if user exists AND has the admin role
    if (!user || user.role !== 'admin') {
        // Redirect to login, but save the current location so we can come back
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    // If they are an admin, render the child routes (the dashboard)
    return <Outlet />;
};

function AdminRoutes() {
  return (
	<Routes>
		<Route path="/admin/login" element={<AdminLoginPage />} />
		<Route path='/admin' element={<AdminRoute />}>
			<Route path="dashboard" element={<AdminDashboard />} />
		</Route>
	</Routes>
  )
}

export default AdminRoutes