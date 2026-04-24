function ChefsPage() {
	return (
		<div className="bg-secondary min-h-screen">
			{/* Profile Header */}
			<div className="h-96 bg-primary overflow-hidden relative">
				<div className="absolute inset-0 bg-neutral/20" />
			</div>
			<div className="max-w-7xl mx-auto px-12 -mt-32 relative z-10">
				<div className="bg-white rounded-[4rem] p-16 shadow-2xl flex flex-col md:flex-row gap-12 items-center">
					<div className="w-48 h-48 rounded-full bg-secondary border-8 border-white overflow-hidden shadow-lg">
						<img
							src="https://api.dicebear.com/7.x/avataaars/svg?seed=Chef"
							className="w-full h-full object-cover"
						/>
					</div>
					<div className="grow space-y-4 text-center md:text-left">
						<h1 className="text-6xl font-bold tracking-tighter text-neutral">
							Chef Dante Alighieri
						</h1>
						<p className="text-xl text-neutral/50 italic">
							Executive Chef at The Florentine Grill
						</p>
						<div className="flex justify-center md:justify-start gap-4">
							<button className="bg-primary text-white px-8 py-3 rounded-full font-bold">
								Follow Chef
							</button>
							<button className="border border-border px-8 py-3 rounded-full font-bold">
								Share Portfolio
							</button>
						</div>
					</div>
				</div>

				{/* Chef's Recipes Grid */}
				<section className="py-20 space-y-12">
					<div className="flex items-center justify-between border-b border-border pb-6">
						<h2 className="text-3xl font-bold">Chef's Library</h2>
						<div className="flex gap-4">
							{["All", "Italian", "Techniques"].map((cat) => (
								<button
									key={cat}
									className="text-[10px] font-black uppercase tracking-widest text-neutral/40 hover:text-primary"
								>
									{cat}
								</button>
							))}
						</div>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-10">
						{/* Use the RecipeCard component from our previous session here */}
					</div>
				</section>
			</div>
		</div>
	);
}

export default ChefsPage;
