import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import privateAxios from "../../helpers/userAxiosPrivate";
import { Link } from "react-router";
import { useContext } from "react";
import { UserContext } from "../../helpers/contexts";
import { apiLogoutRoute } from "../../helpers/constants";
import AdminRecipeListItem from "../../components/AdminRecipeListItem";

function AdminDashboard() {
    const api = privateAxios();
    const queryClient = useQueryClient();
	const { setData } = useContext(UserContext);
    const { data: stats, isLoading } = useQuery({
        queryKey: ["adminStats"],
        queryFn: () => api.get('/admin/stats').then(res => res.data.data)
    });

    // 1. Flag Mutation Logic
    const flagMutation = useMutation({
        mutationFn: ({ id, flagged }) => 
            api.post(`/admin/recipes/${id}/flag`, { flagged }),
        onSuccess: () => {
            // Refetch stats to update the "Reported" count and the table list
            queryClient.invalidateQueries(["adminStats"]);
        },
        onError: (err) => {
            console.error("Failed to update flag status:", err);
        }
    });

    const handleToggleFlag = (recipeId, currentStatus) => {
        flagMutation.mutate({ id: recipeId, flagged: !currentStatus });
    };

	const handleLogout = async () => {
        try {
            await api.get(apiLogoutRoute);
            setData(null);
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    if (isLoading) return <div className="p-20 font-black italic animate-pulse">Accessing Secure Data...</div>;

    return (
        <div className="min-h-screen bg-secondary p-8 md:p-12">
            <header className="flex justify-between items-end mb-12">
                <div>
                    <h2 className="text-sm font-black uppercase tracking-[0.4em] text-primary">Overview</h2>
                    <h1 className="text-5xl font-bold tracking-tighter">System Health</h1>
                </div>
				<button 
                                onClick={handleLogout}
                                className='hidden md:block text-xs font-black uppercase tracking-widest border border-primary text-primary px-5 py-2 rounded-full hover:bg-primary hover:text-white transition-all'
                            >
                                Logout
                            </button>
                <div className="text-right">
                    <p className="text-[10px] font-bold text-neutral/40 uppercase">Last Sync</p>
                    <p className="font-mono text-sm">{new Date().toLocaleTimeString()}</p>
                </div>
            </header>

            {/* STAT CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {[
                    { label: "Total Chefs", val: stats.chefCount, color: "text-primary" },
                    { label: "Masterpieces", val: stats.recipeCount, color: "text-neutral" },
                    { label: "Active Users", val: stats.userCount, color: "text-neutral" },
                    { label: "Reports", val: stats.reportCount, color: "text-red-500" }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-8 rounded-4xl shadow-sm border border-border">
                        <p className="text-[10px] font-black uppercase tracking-widest text-neutral/30 mb-2">{stat.label}</p>
                        <p className={`text-4xl font-bold ${stat.color}`}>{stat.val}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-[3rem] overflow-hidden border border-border shadow-sm">
                <div className="p-8 border-b border-border">
                    <h3 className="font-bold text-xl">Recipes Moderation</h3>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-secondary/50 text-[10px] font-black uppercase tracking-widest text-neutral/40">
                        <tr>
                            <th className="px-8 py-4">Recipe Name</th>
                            <th className="px-8 py-4">Status</th>
                            <th className="px-8 py-4 text-right">Moderation Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {stats.recentRecipes.map((recipe) => (
                            <AdminRecipeListItem 
                                key={recipe._id} 
                                recipe={recipe} 
                                handleToggleFlag={handleToggleFlag} 
                                flagMutation={flagMutation} 
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;