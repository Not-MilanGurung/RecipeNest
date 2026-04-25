import { Link } from "react-router";

const RecipeCard = ({ recipe }) => {
  return (
	<Link to={`/recipes/${recipe._id}`} className="group bg-neutral rounded-4xl overflow-hidden hover:shadow-2xl hover:shadow-neutral transition-all duration-500 cursor-pointer">
	  {/* Image Container with Zoom Effect */}
	  <div className="relative h-64 overflow-hidden">
		<img 
		  src={recipe.image || '/NoImage.jpg'} 
		  alt={recipe.name}
		  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
		/>
		<div className="absolute top-4 right-4 bg-neutral/90 backdrop-blur-md px-3 py-1 rounded-full font-black uppercase tracking-widest text-secondary">
		  {recipe.metrics?.cooktime || '35 min'}
		</div>
	  </div>

	  {/* Content */}
	  <div className="p-8 space-y-4">
		<div className="space-y-2">
		  <h3 className="text-2xl font-bold leading-tight text-secondary group-hover:text-primary transition-colors">
			  {recipe.name}
		  </h3>
		  <p className="text-secondary/50 text-sm line-clamp-2 leading-relaxed">
			{recipe.description || "A masterfully crafted dish focusing on seasonal ingredients and precise technique."}
		  </p>
		</div>

		{/* Chef Attribution */}
		<div className="flex items-center space-x-3 pt-4 border-t border-border">
		  <div className="flex items-center ">
				{recipe.chef.avatar ? (
					<img 
						src={recipe.chef.avatar} 
						alt={recipe.chef.name || 'Chef'} 
						className='w-8 h-8 rounded-full object-cover border-2 border-primary'
					/>
				) : (
					<div className='w-8 h-8 rounded-full bg-primary flex items-center justify-center text-secondary font-bold'>
						{/* Shows first letter of name as fallback */}
						{recipe.chef.name?.charAt(0).toUpperCase() || 'C'}
					</div>
				)}
		  </div>
		  <span className="text-xs font-bold uppercase tracking-tighter text-primary/70">
			{recipe.chef.avatar || 'Chef'}
		  </span>
		</div>
	  </div>
	</Link>
  );
};

export default RecipeCard;