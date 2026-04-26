import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";

import api from "../../helpers/api";
import { apiGetRecipeById } from '../../helpers/constants';
import NavBar from "../../components/NavBar";

function RecipeDetailPage() {
	let params = useParams();
	const { id } = params;

	const { data: recipe, isLoading, error } = useQuery({
		queryKey: ['recipe', id],
		queryFn: () => api.get(apiGetRecipeById(id)).then((response) => {
			return response.data.data.recipe;
		}).catch((error) => {
			console.error('Error fetching recipe details');
			console.error(error);
			throw error;
		})
	});

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p className="text-2xl font-bold text-neutral/50">Loading Recipe...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p className="text-2xl font-bold text-red-500">Error loading recipe details.</p>
			</div>
		);
	}

	return (
		<>
		<NavBar />
		<div className="min-h-screen bg-secondary text-neutral font-sans selection:bg-primary/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* LEFT COLUMN: The Narrative & Steps (8 Cols) */}
        <div className="lg:col-span-8 space-y-16">
          <header className="space-y-8">
            {/* Breadcrumb / Category */}
            <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
              <span>Recipes</span>
              <span className="text-neutral/20">•</span>
              <span>{recipe.category}</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.85] text-neutral">
              {recipe.name}
            </h1>

            {/* Metrics mapped from your metrics object */}
            <div className="flex flex-wrap gap-8 py-6 border-y border-border">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral/40">Prep Time</p>
                <p className="font-bold text-primary">{recipe.metrics.preptime}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral/40">Cook Time</p>
                <p className="font-bold text-primary">{recipe.metrics.cooktime}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral/40">Servings</p>
                <p className="font-bold text-primary">{recipe.metrics.servings} People</p>
              </div>
            </div>

            <p className="text-2xl font-medium leading-relaxed text-neutral/60 italic max-w-3xl">
              "{recipe.description}"
            </p>
          </header>

          {/* Execution / Steps Section */}
          <section className="space-y-12">
            <h2 className="text-4xl font-bold tracking-tight">The Execution</h2>
            <div className="space-y-12">
              {recipe.steps && recipe.steps.map((step, index) => (
                <div key={index} className="flex gap-8 group">
                  <div className="shrink-0">
                    <span className="text-7xl font-black text-primary/10 group-hover:text-primary/30 transition-colors duration-500">
                      {(index + 1).toString().padStart(2, '0')}
                    </span>
                  </div>
                  <div className="pt-4">
                    <p className="text-xl text-neutral/80 leading-relaxed">
                      {step}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Utensils (Conditional Rendering) */}
          {recipe.utensils && (
            <section className="pt-10 border-t border-border">
              <h3 className="text-sm font-black uppercase tracking-widest text-neutral/40 mb-4">Required Utensils</h3>
              <div className="flex flex-wrap gap-2">
                {recipe.utensils.map((item, i) => (
                  <span key={i} className="px-4 py-2 bg-white border border-border rounded-full text-sm font-medium">
                    {item}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* RIGHT COLUMN: Media & Ingredients (4 Cols) */}
        <div className="lg:col-span-4 space-y-10">
          {/* Hero Image from Cloudinary */}
          <div className="aspect-3/4 rounded-[3rem] overflow-hidden shadow-2xl shadow-primary/10 border border-white">
            <img 
              src={recipe.image || '/NoImage.jpg'} 
              alt={recipe.name} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Ingredients */}
          <div className="bg-neutral text-white p-10 rounded-[3rem] shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold">Ingredients</h3>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <span className="text-[10px] font-bold">{recipe.ingredients.length}</span>
              </div>
            </div>
            
            <ul className="space-y-6">
              {recipe.ingredients && recipe.ingredients.map((ing) => (
                <li key={ing._id} className="flex items-start justify-between group cursor-default">
                  <div className="space-y-0.5">
                    <p className="font-bold text-white group-hover:text-primary transition-colors">{ing.name}</p>
                    <p className="text-xs text-white/40 uppercase tracking-widest">
                      {ing.quantity} {ing.unit}
                    </p>
                  </div>
                  <div className="h-5 w-5 rounded-full border border-white/20 mt-1 flex items-center justify-center group-hover:border-primary transition-colors">
                    <div className="h-2 w-2 rounded-full bg-primary scale-0 group-hover:scale-100 transition-transform" />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Chef Attribution */}
          <div className="flex items-center p-6 bg-white rounded-4xl border border-border space-x-4">
            <div className="w-14 h-14 rounded-full bg-secondary border border-border overflow-hidden">
              <img 
                src={recipe.chef.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${recipe.chef.name}`} 
                alt={recipe.chef.name} 
              />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-primary">Curated By</p>
              <p className="text-lg font-bold text-neutral">{recipe.chef.name}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
		</>
	);
}

export default RecipeDetailPage;