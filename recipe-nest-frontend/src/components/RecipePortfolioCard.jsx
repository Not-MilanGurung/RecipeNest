function RecipePortfolioCard({ recipe, isOwner, handleDelete }) {
	return (
		<div
			key={recipe._id}
			className="relative bg-[#1a1a1a] rounded-4xl overflow-hidden group cursor-pointer hover:-translate-y-2 transition-all duration-500"
		>
			{/* DELETE ICON - Only visible to the owner */}
			{isOwner && (
				<button
					onClick={(e) => {
						e.preventDefault(); // Prevent navigating to detail page
						e.stopPropagation(); // Stop event bubbling
						handleDelete(recipe._id, recipe.name);
					}}
					className="absolute top-4 right-4 z-10 p-3 bg-red-500/80 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm shadow-xl"
					title="Delete Recipe"
				>
					<svg
						className="w-4 h-4"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
						/>
					</svg>
				</button>
			)}

			<div className="h-48 overflow-hidden">
				<img
					src={recipe.image || "/NoImage.jpg"}
					className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700"
					alt={recipe.name}
				/>
			</div>
			<div className="p-6 space-y-2">
				<h3 className="text-xl font-bold text-white">{recipe.name}</h3>
				<p className="text-white/40 text-xs line-clamp-2 leading-relaxed">
					{recipe.description}
				</p>
				<div className="pt-4 flex justify-between items-center text-[10px] font-black uppercase text-[#008080] tracking-widest">
					<span>{recipe.metrics.cooktime}</span>
					<span className="text-white group-hover:translate-x-2 transition-transform">
						→
					</span>
				</div>
			</div>
		</div>
	);
}

export default RecipePortfolioCard;
