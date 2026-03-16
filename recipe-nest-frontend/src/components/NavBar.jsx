import {NavLink} from 'react-router';

function NavBar() {
	const navLinkStyle = ({ isActive}) => `
		h-full px-4 flex items-center  cursor-pointer
		${isActive ? `bg-neutral` : `hover:bg-linear-to-b from-50% to-secondary`}
	`;
	return (
		<header className='flex h-20 justify-between pl-[10%] pr-[5%] items-center bg-primary text-secondary'>
			<div className='text-4xl font-bold'>RecipeNest</div>
			<nav className='h-full flex text-xl'>
				<NavLink className={navLinkStyle} to="/">Home</NavLink>
				<NavLink className={navLinkStyle} to="/recipes">Recipes</NavLink>
				<NavLink className={navLinkStyle} to="/chefs">Chefs</NavLink>
				<NavLink className={navLinkStyle} to="/contact">Contact</NavLink>
			</nav>
			<div className='space-x-4 text-xl'>
				<NavLink to="/login" className='bg-neutral rounded-xl px-4 py-1 cursor-pointer hover:bg-neutral/75'>Login</NavLink>
				<NavLink to="/register" className='bg-neutral rounded-xl px-4 py-1 cursor-pointer hover:bg-neutral/75'>Register</NavLink>
			</div>
		</header>
	)
}

export default NavBar