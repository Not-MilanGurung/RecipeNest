import {Link} from 'react-router';

function NavBar() {
  return (
	<nav className='flex justify-around bg-blue-400'>
		<div>RecipeNest</div>
		<div>
			<Link to="/">Home</Link>
			<Link to="/recipes">Recipes</Link>
			<Link to="/chefs">Chefs</Link>
			<Link to="/contact">Contact</Link>
		</div>
	</nav>
  )
}

export default NavBar