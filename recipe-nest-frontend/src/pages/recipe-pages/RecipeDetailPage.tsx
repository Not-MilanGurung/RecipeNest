import { useState, useContext } from "react";
import { useParams, Link } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { type AxiosResponse } from "axios";

import api from "../../helpers/api";
import privateAPi from "../../helpers/userAxiosPrivate";
import { apiGetRecipeById } from "../../helpers/constants";
import { UserContext } from "../../helpers/contexts";
import { NavBar, RatingComponent, CommentSection } from "../../components";


function RecipeDetailPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const authAPI = privateAPi();
  const { data: userData } = useContext(UserContext);
  const currentUser = userData?.user;

  const [isEditing, setIsEditing] = useState(false);

  // 1. Fetch Recipe
  const {
    data: recipe,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["recipe", id],
    queryFn: () =>
      api.get(apiGetRecipeById(id!)).then((res) => res.data.data.recipe),
  });

  // 2. Setup Form
  const { register, handleSubmit, reset } = useForm({
    values: recipe, 
  });

  // 3. Update Mutation
  const updateMutation = useMutation<AxiosResponse, Error, FormData>({
    mutationFn: (formData) =>
      authAPI.put(apiGetRecipeById(id!), formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipe", id!] });
      setIsEditing(false);
    },
  });

  const flagMutation = useMutation<AxiosResponse, Error, { id: string; flagged: boolean }>({
    mutationFn: ({ id, flagged }) =>
      api.post(`/admin/recipes/${id}/flag`, { flagged }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipe", id!] });
    },
  });

  const handleToggleFlag = (recipeId: string, currentStatus: boolean) => {
    flagMutation.mutate({ id: recipeId, flagged: !currentStatus });
  };

  const onSave = (data: any) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("metrics", JSON.stringify(data.metrics));
    formData.append("ingredients", JSON.stringify(data.ingredients));
    formData.append("steps", JSON.stringify(data.steps));

    if (data.image?.[0] instanceof File) {
      formData.append("image", data.image[0]);
    }

    updateMutation.mutate(formData);
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center font-bold italic">
      Setting the table...
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen flex items-center justify-center text-red-500">
      Masterpiece not found.
    </div>
  );

  const isOwner = currentUser?._id === recipe?.chef?._id;
  const isAdmin = currentUser?.role === "admin";
  const canViewContent = !recipe.flagged || isOwner || isAdmin;

  if (!canViewContent) {
    return (
      <>
        <NavBar />
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center">
          <div className="w-24 h-24 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-6">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold tracking-tighter mb-4">Recipe Unavailable</h1>
          <p className="text-neutral/60 max-w-md italic">This masterpiece has been flagged for review.</p>
          <Link to="/recipes" className="mt-8 text-primary font-bold uppercase tracking-widest text-xs border-b border-primary">
            Back to Gallery
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />

      {recipe.flagged && (isOwner || isAdmin) && (
        <div className="bg-red-600 text-white py-3 px-6 flex justify-between items-center sticky top-20 z-40 shadow-xl">
          <div className="flex items-center gap-3">
            <span className="bg-white text-red-600 px-2 py-0.5 rounded text-[10px] font-black uppercase">Flagged</span>
            <p className="text-xs font-bold uppercase tracking-widest">
              {isAdmin ? "Admin View: Hidden from public." : "Notice: Hidden from public."}
            </p>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-secondary text-neutral font-sans selection:bg-primary/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
          
          {/* Main Recipe Form - Covers only Recipe Metadata */}
          <form onSubmit={handleSubmit(onSave)}>
            {isOwner && (
              <div className="flex justify-end gap-4 mb-8">
                {isEditing ? (
                  <>
                    <button type="button" onClick={() => { setIsEditing(false); reset(); }} className="px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest text-neutral/40">
                      Cancel
                    </button>
                    <button type="submit" disabled={updateMutation.isPending} className="px-8 py-2 bg-primary text-white rounded-full font-bold text-xs uppercase tracking-widest shadow-lg flex items-center gap-2">
                      {updateMutation.isPending && <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                      Save Changes
                    </button>
                  </>
                ) : (
                  <button type="button" onClick={() => setIsEditing(true)} className="px-8 py-2 border-2 border-primary text-primary rounded-full font-bold text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                    Edit Recipe
                  </button>
                )}
              </div>
            )}

            {isAdmin && (
              <div className="flex justify-end gap-4 mb-8">
                <button type="button" onClick={() => handleToggleFlag(recipe._id, recipe.flagged)} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${recipe.flagged ? "bg-neutral text-white" : "border border-red-500 text-red-500"}`}>
                  {flagMutation.isPending ? "Updating..." : recipe.flagged ? "Unflag" : "Flag Entry"}
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              {/* LEFT COLUMN: Header & Execution */}
              <div className="lg:col-span-8 space-y-16">
                <header className="space-y-8">
                  <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                    <span>Recipes</span>
                    <span className="text-neutral/20">•</span>
                    {isEditing ? <input {...register("category")} className="bg-white px-2 py-1 rounded border border-border outline-none" /> : <span>{recipe.category}</span>}
                  </div>

                  {isEditing ? (
                    <input {...register("name")} className="w-full text-6xl font-bold tracking-tighter bg-transparent border-b-2 border-primary/20 outline-none" />
                  ) : (
                    <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.85] text-neutral">{recipe.name}</h1>
                  )}

                  <div className="flex flex-wrap gap-8 py-6 border-y border-border">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-neutral/40">Prep Time</p>
                      {isEditing ? <input {...register("metrics.preptime")} className="font-bold text-primary bg-transparent outline-none w-20" /> : <p className="font-bold text-primary">{recipe.metrics.preptime}</p>}
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-neutral/40">Cook Time</p>
                      {isEditing ? <input {...register("metrics.cooktime")} className="font-bold text-primary bg-transparent outline-none w-20" /> : <p className="font-bold text-primary">{recipe.metrics.cooktime}</p>}
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-neutral/40">Servings</p>
                      {isEditing ? <input type="number" {...register("metrics.servings")} className="font-bold text-primary bg-transparent outline-none w-12" /> : <p className="font-bold text-primary">{recipe.metrics.servings} People</p>}
                    </div>
                  </div>

                  {isEditing ? (
                    <textarea {...register("description")} className="w-full text-2xl font-medium italic bg-white p-4 rounded-2xl border border-border outline-none" rows={3} />
                  ) : (
                    <p className="text-2xl font-medium leading-relaxed text-neutral/60 italic max-w-3xl">"{recipe.description}"</p>
                  )}
                </header>

                <section className="space-y-12">
                  <h2 className="text-4xl font-bold tracking-tight">The Execution</h2>
                  <div className="space-y-12">
                    {recipe.steps.map((step: string, index: number) => (
                      <div key={index} className="flex gap-8 group">
                        <div className="shrink-0">
                          <span className="text-7xl font-black text-primary/10">{(index + 1).toString().padStart(2, "0")}</span>
                        </div>
                        <div className="pt-4 grow">
                          {isEditing ? (
                            <textarea {...register(`steps.${index}`)} className="w-full bg-white p-4 rounded-xl border border-border text-lg outline-none" rows={2} />
                          ) : (
                            <p className="text-xl text-neutral/80 leading-relaxed">{step}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* RIGHT COLUMN: Media & Ingredients */}
              <div className="lg:col-span-4 space-y-10">
                <div className="aspect-3/4 rounded-[3rem] overflow-hidden shadow-2xl border border-white">
                  <img src={recipe.image || "/NoImage.jpg"} alt={recipe.name} className="w-full h-full object-cover" />
                </div>

                {/* Rating component (No form inside) */}
                <div className="bg-white p-8 rounded-[3rem] border border-border shadow-sm flex flex-col items-center text-center space-y-2">
                  <RatingComponent recipeId={recipe._id} ratingAverage={recipe.ratingAverage} ratingCount={recipe.ratingCount} />
                </div>

                <div className="bg-neutral text-white p-10 rounded-[3rem] shadow-xl">
                  <h3 className="text-2xl font-bold mb-8">Ingredients</h3>
                  <ul className="space-y-6">
                    {recipe.ingredients.map((ing: { quantity: string; unit: string; name: string }, index: number) => (
                      <li key={index} className="flex flex-col border-b border-white/10 pb-4 last:border-none">
                        {isEditing ? (
                          <div className="flex gap-2">
                            <input {...register(`ingredients.${index}.quantity`)} className="w-12 bg-white/10 rounded px-1 text-xs" />
                            <input {...register(`ingredients.${index}.unit`)} className="w-16 bg-white/10 rounded px-1 text-xs" />
                            <input {...register(`ingredients.${index}.name`)} className="grow bg-white/10 rounded px-1 text-xs font-bold" />
                          </div>
                        ) : (
                          <>
                            <p className="font-bold text-white">{ing.name}</p>
                            <p className="text-xs text-white/40 uppercase tracking-widest">{ing.quantity} {ing.unit}</p>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center p-6 bg-white rounded-4xl border border-border space-x-4">
                  <div className="w-14 h-14 rounded-full bg-secondary border border-border overflow-hidden">
                    <img src={recipe.chef.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${recipe.chef.name}`} alt={recipe.chef.name} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary">Curated By</p>
                    <p className="text-lg font-bold text-neutral">{recipe.chef.name}</p>
                  </div>
                </div>
              </div>
            </div>
          </form>

          {/* Social Section - Completely Outside the Recipe Metadata Form */}
          <div className="mt-24 border-t border-border pt-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              <div className="lg:col-span-8">
                {!isEditing && (
                  <CommentSection recipeId={recipe._id} currentUser={currentUser} />
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default RecipeDetailPage;