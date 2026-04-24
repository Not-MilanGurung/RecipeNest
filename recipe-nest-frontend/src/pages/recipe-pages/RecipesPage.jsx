import NavBar from "../../components/NavBar";

function RecipesPage() {
	return (
		<div>
			<NavBar />
			<div className="min-h-screen bg-secondary flex">
				{/* Sidebar Filters */}
				<aside className="w-80 p-12 bg-white border-r border-border h-screen sticky top-0 hidden lg:block">
					<h2 className="text-4xl font-bold mb-10">Filters</h2>
					<div className="space-y-10">
						<section>
							<label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-4 block">
								Search
							</label>
							<input
								type="text"
								className="w-full p-4 bg-secondary rounded-xl border-none outline-none focus:ring-2 focus:ring-primary/20"
								placeholder="Ingredients, dish..."
							/>
						</section>
						{/* Category Checkboxes */}
						<section className="space-y-3">
							<label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-4 block">
								Categories
							</label>
							{["Fine Dining", "Quick-Service", "Pastry", "Vegan"].map(
								(cat) => (
									<label
										key={cat}
										className="flex items-center space-x-3 cursor-pointer group"
									>
										<input
											type="checkbox"
											className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
										/>
										<span className="text-sm font-medium group-hover:text-primary">
											{cat}
										</span>
									</label>
								),
							)}
						</section>
					</div>
				</aside>

				{/* Main Content */}
				<main className="grow p-12 space-y-8">
					<div className="flex justify-between items-center mb-12">
						<p className="text-neutral/40 font-bold">Showing 124 Results</p>
						<select className="bg-transparent font-bold text-sm border-none outline-none text-primary">
							<option>Sort by: Latest</option>
							<option>Sort by: Rating</option>
						</select>
					</div>

					{/* List Items */}
					<div className="space-y-6">
						{[1, 2, 3].map((i) => (
							<div
								key={i}
								className="bg-white p-6 rounded-4xl border border-border flex gap-8 group hover:shadow-xl transition-all"
							>
								<div className="w-64 h-44 rounded-3xl overflow-hidden bg-primary-muted">
									<img
										src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
										className="w-full h-full object-cover group-hover:scale-105 transition-transform"
									/>
								</div>
								<div className="grow flex flex-col justify-between py-2">
									<div>
										<div className="flex gap-2 mb-3">
											<span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-full uppercase">
												Main
											</span>
										</div>
										<h3 className="text-3xl font-bold mb-2">
											Seared Scallops & Pea Purée
										</h3>
										<p className="text-neutral/50 text-sm italic">
											"A delicate balance of sweetness and earthiness..."
										</p>
									</div>
									<div className="flex items-center justify-between border-t border-border pt-4">
										<span className="text-xs font-bold text-neutral/60">
											Chef Dante Alighieri • 4.9/5
										</span>
										<button className="text-primary font-bold text-sm">
											View Technique →
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				</main>
			</div>
		</div>
	);
}

export default RecipesPage;
