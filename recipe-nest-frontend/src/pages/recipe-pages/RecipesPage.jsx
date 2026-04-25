import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import api from '../../helpers/api';
import { apiGetRecipes } from '../../helpers/constants';
import NavBar from '../../components/NavBar';
import RecipeSearchCard from '../../components/RecipeSearchCard';

const categories = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Beverage'];

function RecipesListPage() {
  // 1. This state holds the "Confirmed" parameters for the API.
  // This is what the user sees on the screen, not what they are currently typing/clicking.
  const [activeFilters, setActiveFilters] = useState({
    search: '',
    category: [],
    sort: '-createdAt',
    page: 1
  });

  const { register, handleSubmit, setValue } = useForm({
    defaultValues: activeFilters
  });

  // 2. TanStack Query ONLY watches activeFilters. 
  // It is now deaf to live changes in the form.
  const { data, isLoading, isPlaceholderData, isError } = useQuery({
    queryKey: ['recipes', activeFilters], 
    queryFn: async () => {
      const response = await api.get(apiGetRecipes, { 
        params: activeFilters, 
        paramsSerializer: { indexes: null } 
      });
      return response.data; 
    },
    placeholderData: (prev) => prev,
  });

  // 3. Triggered by the "Apply" button or Search icon
  const onApplyFilters = (formData) => {
    setActiveFilters({ ...formData, page: 1 });
  };

  // Pagination usually needs to feel responsive, so we trigger it directly
  const handlePageChange = (newPage) => {
    setActiveFilters(prev => ({ ...prev, page: newPage }));
    setValue("page", newPage);
  };

  if (isError) {
    return (
      <div className="min-h-screen bg-secondary">
        <NavBar />
        <main className="p-16 text-center">
          <p className="text-red-500 font-bold">Error occurred while fetching recipes.</p>
          <button onClick={() => window.location.reload()} className="mt-4 text-primary underline">Retry</button>
        </main>
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-secondary flex flex-col lg:flex-row">
        
        {/* SIDEBAR: Form only updates internal RHF state */}
        <aside className="w-full lg:w-80 p-12 bg-white border-r border-border lg:h-screen lg:sticky lg:top-0 overflow-y-auto">
          <h2 className="text-4xl font-bold mb-10 tracking-tighter text-neutral">Library</h2>
          
          <form onSubmit={handleSubmit(onApplyFilters)} className="space-y-12">
            <section className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary block">Search</label>
              <div className="relative group">
                <input 
                  {...register("search")}
                  type="text" 
                  className="w-full p-4 pr-12 bg-secondary rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary/20 transition-all" 
                  placeholder="Ingredients..." 
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-primary hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </button>
              </div>
            </section>

            <section className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary block">Categories</label>
              <div className="space-y-3">
                {categories.map(cat => (
                  <label key={cat} className="flex items-center space-x-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      value={cat}
                      {...register("category")}
                      className="w-5 h-5 rounded border-border text-primary focus:ring-primary transition-all cursor-pointer" 
                    />
                    <span className="text-sm font-medium text-neutral/60 group-hover:text-primary transition-colors">{cat}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* Apply Button: Crucial for your decoupled intent */}
            <button 
              type="submit" 
              className="w-full py-4 bg-primary text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 hover:bg-neutral transition-all"
            >
              Apply Selection
            </button>
          </form>
        </aside>

        <main className={`grow p-8 lg:p-16 space-y-12 transition-opacity duration-300 ${isPlaceholderData ? 'opacity-50' : 'opacity-100'}`}>
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="text-neutral/40 font-bold mb-1">
                {activeFilters.search ? `Results for "${activeFilters.search}"` : `Showing ${data?.data.pagination.total || 0} Results`}
              </p>
              <h1 className="text-6xl font-bold tracking-tighter text-neutral">Techniques</h1>
            </div>
            
            {/* Sort Dropdown: We register it, but it only fires when "Apply" is clicked (or you can add an onChange handle) */}
            <select 
              {...register("sort")}
              className="bg-transparent font-bold text-sm border-none outline-none text-primary cursor-pointer border-b-2 border-transparent hover:border-primary transition-all"
            >
              <option value="-createdAt">Sort by: Latest</option>
              <option value="name">Sort by: Name</option>
            </select>
          </div>

          <div className="space-y-8">
            {isLoading && !data ? (
              [1, 2, 3].map(i => <div key={i} className="h-56 bg-white animate-pulse rounded-4xl border border-border" />)
            ) : (
              data?.data.recipes.map((recipe) => (
                <RecipeSearchCard key={recipe._id} recipe={recipe} />
              ))
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-8 pt-12">
            <button 
              disabled={activeFilters.page === 1}
              onClick={() => handlePageChange(activeFilters.page - 1)}
              className="text-[10px] font-black uppercase tracking-widest text-neutral hover:text-primary disabled:opacity-20 transition-all"
            >
              ← Previous
            </button>
            <div className="flex items-center gap-2">
               <span className="text-primary font-bold text-xl">{activeFilters.page}</span>
               <span className="text-neutral/20 text-xl">/</span>
               <span className="text-neutral/40 font-bold text-xl">{data?.data.pagination.pages || 1}</span>
            </div>
            <button 
              disabled={activeFilters.page >= (data?.data.pagination.pages || 1)}
              onClick={() => handlePageChange(activeFilters.page + 1)}
              className="text-[10px] font-black uppercase tracking-widest text-neutral hover:text-primary disabled:opacity-20 transition-all"
            >
              Next →
            </button>
          </div>
        </main>
      </div>
    </>
  );
}

export default RecipesListPage;