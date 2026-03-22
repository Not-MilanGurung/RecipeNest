import {NavLink} from 'react-router';

function NavBar() {
	const navLinkStyle = ({ isActive}) => `
		h-full px-4 flex items-center  cursor-pointer
		${isActive ? `text-primary underline underline-offset-10` : `hover:underline underline-offset-10`}
	`;
	return (
		<header className='flex h-20 justify-between pl-[10%] pr-[5%] shadow-2xl  items-center bg-secondary text-neutral'>
			<NavLink to="/" className='text-4xl font-bold text-primary'>RecipeNest</NavLink>
			<nav className='h-full flex text-xl'>
				<NavLink className={navLinkStyle} to="/recipes">Recipes</NavLink>
				<NavLink className={navLinkStyle} to="/chefs">Chefs</NavLink>
				<NavLink className={navLinkStyle} to="/contact">Contact</NavLink>
			</nav>
			<div className='space-x-4 text-xl'>
				<NavLink to="/login" className='text-primary rounded-md  px-4 py-1 cursor-pointer hover:bg-primary hover:text-white'>Login</NavLink>
				<NavLink to="/register" className='bg-primary text-secondary rounded-md px-4 py-1 cursor-pointer hover:bg-primary/75'>Register</NavLink>
			</div>
		</header>
	)
}

export default NavBar