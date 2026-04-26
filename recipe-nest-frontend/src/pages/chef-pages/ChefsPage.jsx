import { useState, useContext, useRef } from "react";
import { UserContext } from "../../helpers/contexts";
import { Link, useParams } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import privateAxios from "../../helpers/userAxiosPrivate";
import { apiPortfolioRoute } from "../../helpers/constants";

import NavBar from "../../components/NavBar";

const ChefPortfolioPage = () => {
    const { id } = useParams();
    const { data } = useContext(UserContext);
    const currentUser = data?.user;

    const queryClient = useQueryClient();
    const api = privateAxios();

    const [isEditing, setIsEditing] = useState(false);
    const [selectedBanner, setSelectedBanner] = useState(null);
    const bannerInputRef = useRef(null);

    // 1. Fetch Chef Data & Their Recipes
    const { data: chefData, isLoading } = useQuery({
        queryKey: ["chefPortfolio", id],
        queryFn: () =>
            api.get(apiPortfolioRoute(id)).then((res) => res.data.data),
    });

    const isOwner = currentUser?._id === id;

    // useForm handles the state of our bio and socials
    const { register, handleSubmit, reset } = useForm({
        values: chefData?.chef, 
    });

    // 2. Update Mutation
    const updateMutation = useMutation({
        mutationFn: (formData) => {
			console.log(formData);
            return api.put(`/users/portfolio`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["chefPortfolio", id]);
            setIsEditing(false);
            setSelectedBanner(null);
        },
    });

    // This function is triggered by handleSubmit
    const onSave = (formDataJson) => {
        const formData = new FormData();
        
        // Append text fields
        formData.append("bio", formDataJson.bio || "");
        
        // Stringify socials for Multer/Backend processing
        if (formDataJson.socials) {
            formData.append("socials", JSON.stringify(formDataJson.socials));
        }

        // Append the banner file if one was selected via the input
        if (selectedBanner) {
            formData.append("banner", selectedBanner);
        }
		console.log(formDataJson);
		console.log(formData);
        updateMutation.mutate(formData);
    };

    const handleBannerChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedBanner(e.target.files[0]);
            setIsEditing(true); 
        }
    };

    if (isLoading)
        return (
            <div className="min-h-screen bg-secondary flex items-center justify-center font-bold italic">
                Setting the Atelier...
            </div>
        );

    const bannerSrc = selectedBanner 
        ? URL.createObjectURL(selectedBanner) 
        : (chefData?.chef.banner || '/NoImage.jpg');

    return (
        <div className="min-h-screen bg-white">
            <NavBar />

            {/* THE MAIN FORM WRAPPER */}
            <form onSubmit={handleSubmit(onSave)}>
                {/* HERO BANNER */}
                <div className="relative h-64 md:h-80 w-full bg-neutral overflow-hidden">
                    <img
                        src={bannerSrc}
                        className="w-full h-full object-cover opacity-60"
                        alt="Kitchen Banner"
                    />
                    {isOwner && (
                        <>
                            <input 
                                type="file" 
                                ref={bannerInputRef} 
                                className="hidden" 
                                accept="image/*"
                                onChange={handleBannerChange}
                            />
                            <button 
                                type="button"
                                onClick={() => bannerInputRef.current.click()}
                                className="absolute bottom-4 right-4 bg-white/20 hover:bg-white/40 text-white px-4 py-2 rounded-full text-xs font-bold backdrop-blur-md transition-all"
                            >
                                Change Cover
                            </button>
                        </>
                    )}
                </div>

                {/* PROFILE HEADER */}
                <div className="max-w-7xl mx-auto px-6 pb-12">
                    <div className="relative -mt-20 flex flex-col md:flex-row items-end gap-6 mb-8">
                        <div className="relative">
                            <img
                                src={chefData?.chef.avatar || "/DefaultAvatar.jpg"}
                                className="w-40 h-40 rounded-full border-8 border-white shadow-xl object-cover"
                                alt={chefData?.chef.name}
                            />
                            {isOwner && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                                    <span className="text-white text-[10px] font-bold uppercase">Update</span>
                                </div>
                            )}
                        </div>

                        <div className="grow pb-2">
                            <h1 className="text-4xl font-bold text-neutral tracking-tighter">
                                {chefData?.chef.name}
                            </h1>
                            <p className="text-neutral/40 font-bold text-sm italic">
                                {chefData?.chef.organization || "Independent Artisan"}
                            </p>
                        </div>

                        <div className="flex gap-3 pb-2">
                            {isOwner ? (
                                <div className="flex gap-2">
                                    {isEditing && (
                                        <button
                                            type="submit" // Trigger handleSubmit(onSave)
                                            disabled={updateMutation.isPending}
                                            className="bg-green-600 text-white px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest shadow-lg hover:bg-green-700 transition-all flex items-center gap-2"
                                        >
                                            {updateMutation.isPending && <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                                            Save
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (isEditing) {
                                                reset(); // Revert form changes
                                                setSelectedBanner(null);
                                            }
                                            setIsEditing(!isEditing);
                                        }}
                                        className="bg-primary text-white px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest shadow-lg hover:scale-105 transition-transform"
                                    >
                                        {isEditing ? "Cancel" : "Edit Portfolio"}
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <button type="button" className="bg-primary text-white px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform">
                                        Follow
                                    </button>
                                    <button type="button" className="p-3 border border-border rounded-full hover:bg-secondary transition-colors">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z" />
                                        </svg>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* BIO & SOCIALS */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 border-t border-border pt-8">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-neutral/30">
                                <span>{chefData?.followersCount || 0} Followers</span>
                                <span>Rating: {chefData?.rating || "X.X"}/5</span>
                            </div>

                            {isEditing ? (
                                <textarea
                                    {...register("bio")}
                                    className="w-full p-6 bg-secondary rounded-4xl outline-none border-none text-neutral h-32 italic"
                                    placeholder="Introduce yourself..."
                                />
                            ) : (
                                <p className="text-neutral/60 leading-relaxed max-w-2xl">
                                    {chefData?.chef.bio || "No biography provided yet."}
                                </p>
                            )}

                            <div className="flex flex-wrap gap-4">
                                {chefData.chef.socials?.map((platform) => (
                                    <button
                                        key={platform}
                                        type="button"
                                        className="px-6 py-2 bg-secondary rounded-full text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-primary hover:text-white transition-all"
                                    >
                                        {platform}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </form>

            {/* RECIPE SECTION (Remains outside the form) */}
            <section className="bg-primary py-20 px-6 min-h-[600px]">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-wrap gap-4 mb-16">
                        {["Chef's Choice", "Mains", "Pastry", "Quick"].map((cat, i) => (
                            <button
                                key={cat}
                                className={`px-8 py-3 rounded-full text-xs font-bold transition-all ${i === 0 ? "bg-neutral text-white" : "bg-white text-neutral hover:bg-neutral/10"}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {chefData?.recipes.map((recipe) => (
                            <div
                                key={recipe._id}
                                className="bg-[#1a1a1a] rounded-4xl overflow-hidden group cursor-pointer hover:-translate-y-2 transition-all duration-500"
                            >
                                <div className="h-48 overflow-hidden">
                                    <img
                                        src={recipe.image || '/NoImage.jpg'}
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
                                        <span className="text-white group-hover:translate-x-2 transition-transform">→</span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isOwner && (
                            <Link to='/recipes/create' className="border-2 border-dashed border-white/20 rounded-4xl flex flex-col items-center justify-center p-12 text-white/40 hover:text-white hover:border-white transition-all gap-4">
                                <span className="text-4xl">+</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest">Add New Recipe</span>
                            </Link>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ChefPortfolioPage;