import { NavLink } from 'react-router';
import { useContext } from 'react';
import { UserContext } from '../helpers/contexts'; // Adjust path as needed
import { apiLogoutRoute } from '../helpers/constants';
import { Link } from 'react-router';
import api from '../helpers/api';

function NavBar() {
    const { data, setData } = useContext(UserContext);
	const user = data?.user;
    const navLinkStyle = ({ isActive }) => `
        h-full px-4 flex items-center cursor-pointer
        ${isActive ? `text-primary underline underline-offset-10` : `hover:underline underline-offset-10`}
    `;

    const handleLogout = async () => {
		await api.get(apiLogoutRoute);
        // Clear local state
        setData(null);
        // Optionally: Call your backend /logout endpoint to clear the HttpOnly cookie
    };

    return (
        <header className='flex h-20 justify-between pl-[10%] pr-[5%] shadow-2xl items-center bg-secondary text-neutral'>
            <NavLink to="/" className='text-4xl font-bold text-primary'>RecipeNest</NavLink>
            
            <nav className='h-full flex text-xl'>
                <NavLink className={navLinkStyle} to="/recipes">Recipes</NavLink>
                {/* <NavLink className={navLinkStyle} to="/contact">Contact</NavLink> */}
                {/* Example: Only show My Recipes if logged in */}
                {user?.role === 'chef' && <NavLink className={navLinkStyle} to={`/chefs/${user._id}`}>My Portfolio</NavLink>}
            </nav>

            <div className='flex items-center space-x-4 text-xl'>
                {user ? (
                    <div className='flex items-center space-x-4'>
						{/* Profile Section */}
						<div className='flex items-center space-x-2'>
							{user.avatar ? (
								<img 
									src={user.avatar} 
									alt={user.name || 'User'} 
									className='w-10 h-10 rounded-full object-cover border-2 border-primary'
								/>
							) : (
								<div className='w-10 h-10 rounded-full bg-primary flex items-center justify-center text-secondary font-bold'>
									{/* Shows first letter of name as fallback */}
									{user.name?.charAt(0).toUpperCase() || 'C'}
								</div>
							)}
							<Link to='/profile' className='hidden md:block font-medium'>{user.name}</Link>
						</div>

						<button 
							onClick={handleLogout}
							className='text-primary border border-primary rounded-md px-4 py-1 hover:bg-primary cursor-pointer hover:text-secondary transition-all'
						>
							Logout
						</button>
					</div>
                ) : (
                    <>
                        <NavLink to="/login" className='text-primary border border-primary rounded-md px-4 py-1 cursor-pointer hover:bg-primary hover:text-white'>
                            Login
                        </NavLink>
                        <NavLink to="/register" className='bg-primary text-secondary rounded-md px-4 py-1 cursor-pointer hover:bg-primary/80'>
                            Register
                        </NavLink>
                    </>
                )}
            </div>
        </header>
    );
}

export default NavBar;