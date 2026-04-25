import { Link } from 'react-router';

function RecipeSearchCard({ recipe }) {
	return (
		<Link
			to={`/recipes/${recipe._id}`}
			key={recipe._id}
			className="bg-white p-6 rounded-[2.5rem] border border-border flex flex-col md:flex-row gap-8 group hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 cursor-pointer"
		>
			{/* Image Container */}
			<div className="w-full md:w-72 h-48 rounded-4xl overflow-hidden bg-primary-muted shrink-0">
				<img
					src={recipe.image || "/NoImage.jpg"}
					alt={recipe.name}
					className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
				/>
			</div>

			{/* Content Container */}
			<div className="grow flex flex-col justify-between py-2">
				<div>
					<div className="flex gap-2 mb-3">
						<span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-full uppercase tracking-tighter">
							{recipe.category || "Masterpiece"}
						</span>
						<span className="px-3 py-1 bg-secondary text-neutral/40 text-[10px] font-black rounded-full uppercase tracking-tighter">
							{recipe.metrics.cooktime}
						</span>
					</div>

					<h3 className="text-3xl font-bold mb-2 group-hover:text-primary transition-colors tracking-tight">
						{recipe.name}
					</h3>
					<p className="text-neutral/50 text-sm italic line-clamp-2 max-w-2xl leading-relaxed">
						"{recipe.description}"
					</p>
				</div>

				{/* Footer Info */}
				<div className="flex items-center justify-between border-t border-border pt-5 mt-4">
					<div className="flex items-center gap-3">
						<div className="w-6 h-6 rounded-full bg-secondary border border-border overflow-hidden">
							<img
								src={
									recipe.chef?.avatar ||
									`https://api.dicebear.com/7.x/avataaars/svg?seed=${recipe.chef?.name}`
								}
								alt="chef"
							/>
						</div>
						<span className="text-[11px] font-bold uppercase tracking-widest text-neutral/60">
							{recipe.chef?.name}
						</span>
					</div>
					<button className="text-primary font-bold text-xs uppercase tracking-[0.2em] flex items-center gap-2 group-hover:gap-4 transition-all">
						View Technique <span>→</span>
					</button>
				</div>
			</div>
		</Link>
	);
}

export default RecipeSearchCard;
