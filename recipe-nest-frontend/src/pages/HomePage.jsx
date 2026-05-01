import NavBar from "../components/NavBar";
import RecipeCard from "../components/RecipeCard";

import { useEffect, useState } from "react";
import api from "../helpers/api";
import { apiGetRecipes } from "../helpers/constants";
import { Link } from "react-router";

function HomePage() {
  const [trendingRecipes, setTrendingRecipes] = useState([]);
  useEffect(() => {
    api
      .get(apiGetRecipes, {
        params: {
          page: 1,
          limit: 10,
        },
      })
      .then((response) => {
        setTrendingRecipes(response.data.data.recipes);
      })
      .catch((error) => {
        console.error("Error refreshing token");
        console.error(error);
      });
  }, []);

  return (
    <>
      <NavBar />
      <div className="min-h-screen  selection:bg-primary/10">
        {/* Hero Section */}
        <section className="relative px-12 py-24 md:py-32 overflow-hidden">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 relative z-10">
              <div className="inline-block px-4 py-1.5 bg-primary/10 rounded-full">
                <span className="text-xs font-black uppercase tracking-widest text-primary">
                  Est. 2026
                </span>
              </div>
              <h1 className="text-7xl md:text-8xl font-light tracking-tighter text-neutral leading-[0.9]">
                Elevate your <br />
                <span className="font-bold text-primary italic">
                  culinary nest.
                </span>
              </h1>
              <p className="text-xl text-neutral/60 max-w-md leading-relaxed">
                A refined community for chefs to document, share, and discover
                world-class techniques and recipes.
              </p>
              <div className="flex items-center space-x-4 pt-4">
                <Link
                  to="/recipes"
                  className="bg-primary text-white px-10 py-4 rounded-full font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                >
                  Explore Recipes
                </Link>
                <button className="bg-white border border-border text-neutral px-10 py-4 rounded-full font-bold hover:bg-neutral hover:text-white transition-all">
                  Join the Kitchen
                </button>
              </div>
            </div>

            {/* Large Hero Image with Nest Styling */}
            <div className="relative">
              <div className="aspect-square rounded-[4rem] overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-1000">
                <img
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80"
                  className="w-full h-full object-cover"
                  alt="Fine dining table"
                />
              </div>
              {/* Abstract background shape */}
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
            </div>
          </div>
        </section>

        {/* Trending Section */}
        <section className="px-12 py-24 bg-primary rounded-t-[5rem] shadow-[0_-30px_60px_-15px_rgba(0,0,0,0.05)]">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-16">
              <div className="space-y-2">
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-secondary">
                  Curated Selection
                </h2>
                <p className="text-5xl font-bold text-secondary">
                  Trending Now
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {trendingRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter / Call to Action */}
        <section className="px-12 py-32 bg-neutral text-secondary text-center">
          <div className="max-w-2xl mx-auto space-y-8">
            <h3 className="text-4xl font-bold">Never miss a masterpiece.</h3>
            <p className="text-secondary/40">
              Get weekly deep-dives into sourcing, plating, and molecular
              gastronomy.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}

export default HomePage;
