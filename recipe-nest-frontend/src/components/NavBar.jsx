import { NavLink, Link } from 'react-router';
import { useContext, useState } from 'react';
import { UserContext } from '../helpers/contexts';
import { apiLogoutRoute } from '../helpers/constants';
import api from '../helpers/api';

function NavBar() {
    const { data, setData } = useContext(UserContext);
    const user = data?.user;
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinkStyle = ({ isActive }) => `
        h-full px-4 flex items-center cursor-pointer transition-all
        ${isActive ? `text-primary border-b-2 border-primary` : `hover:text-primary`}
    `;

    const handleLogout = async () => {
        try {
            await api.get(apiLogoutRoute);
            setData(null);
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    return (
        <header className='sticky top-0 z-50 w-full h-20 bg-secondary text-neutral shadow-lg px-6 md:px-12 lg:px-[10%]'>
            <div className='flex h-full justify-between items-center max-w-7xl mx-auto'>
                
                {/* LOGO */}
                <NavLink to="/" className='text-3xl md:text-4xl font-bold text-primary tracking-tighter'>
                    RecipeNest
                </NavLink>

                {/* DESKTOP NAV */}
                <nav className='hidden md:flex h-full text-lg font-medium'>
                    <NavLink className={navLinkStyle} to="/recipes">Recipes</NavLink>
                    {user?.role === 'chef' && (
                        <NavLink className={navLinkStyle} to={`/chefs/${user._id}`}>
                            My Portfolio
                        </NavLink>
                    )}
                </nav>

                {/* USER ACTIONS & HAMBURGER */}
                <div className='flex items-center space-x-4'>
                    {user ? (
                        <div className='flex items-center space-x-3 md:space-x-6'>
                            {/* Profile Info */}
                            <Link to='/profile' className='flex items-center space-x-2 group'>
                                {user.avatar ? (
                                    <img 
                                        src={user.avatar} 
                                        alt={user.name} 
                                        className='w-10 h-10 rounded-full object-cover border-2 border-transparent group-hover:border-primary transition-all'
                                    />
                                ) : (
                                    <div className='w-10 h-10 rounded-full bg-primary flex items-center justify-center text-secondary font-bold'>
                                        {user.name?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <span className='hidden lg:block font-bold text-sm uppercase tracking-widest text-neutral/60 group-hover:text-primary'>
                                    {user.name}
                                </span>
                            </Link>

                            <button 
                                onClick={handleLogout}
                                className='hidden md:block text-xs font-black uppercase tracking-widest border border-primary text-primary px-5 py-2 rounded-full hover:bg-primary hover:text-white transition-all'
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className='hidden md:flex items-center space-x-4'>
                            <NavLink to="/login" className='text-sm font-bold uppercase tracking-widest text-primary'>
                                Login
                            </NavLink>
                            <NavLink to="/register" className='text-sm font-bold uppercase tracking-widest bg-primary text-white px-6 py-2 rounded-full'>
                                Join
                            </NavLink>
                        </div>
                    )}

                    {/* MOBILE MENU BUTTON */}
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className='md:hidden p-2 text-primary'
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* MOBILE OVERLAY MENU */}
            <div className={`
                fixed inset-0 top-20 bg-secondary z-40 flex flex-col p-8 space-y-8 transform transition-transform duration-300 md:hidden
                ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
            `}>
                <NavLink onClick={() => setIsMenuOpen(false)} to="/recipes" className='text-3xl font-bold'>Recipes</NavLink>
                
                {user?.role === 'CHEF' && (
                    <NavLink onClick={() => setIsMenuOpen(false)} to={`/chefs/${user._id}`} className='text-3xl font-bold'>
                        My Portfolio
                    </NavLink>
                )}

                <div className='pt-8 border-t border-border flex flex-col space-y-4'>
                    {user ? (
                        <button 
                            onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                            className='text-left text-2xl font-bold text-red-500'
                        >
                            Logout
                        </button>
                    ) : (
                        <>
                            <NavLink onClick={() => setIsMenuOpen(false)} to="/login" className='text-2xl font-bold'>Login</NavLink>
                            <NavLink onClick={() => setIsMenuOpen(false)} to="/register" className='text-2xl font-bold text-primary'>Register</NavLink>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

export default NavBar;