import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router";
import { useContext } from "react";

import { UserContext } from "../../helpers/contexts";
import api from "../../helpers/api";
import { apiLoginRoute } from "../../helpers/constants";

function AdminLoginPage() {
  const { setData } = useContext(UserContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string; password: string }>();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<{ email: string; password: string }> = async ({ email, password }) => {
    try {
      const res = await api.post(apiLoginRoute, { email, password });
      setData(res.data.data); // Stores user and accessToken
      navigate("/admin/dashboard");
    } catch (err) {
      alert("Unauthorized: Admin credentials required.");
      console.log("Error logging in:", err);
    }
  };

  return (
    <div className="min-h-screen bg-neutral flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white rounded-[3rem] p-12 shadow-2xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black uppercase tracking-tighter text-neutral">
            Recipe<span className="text-primary">Nest</span>
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral/40 mt-2">Command Center</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <input
              type="email"
              placeholder="Admin Email"
              className="w-full px-6 py-4 bg-secondary rounded-full outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Email is invalid",
                },
              })}
            />
            {errors.email && <span className="error-message text-red-400">{errors.email.message as string}</span>}
          </div>
          <div>
            <input
              type="password"
              placeholder="Secret Key"
              className="w-full px-6 py-4 bg-secondary rounded-full outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              {...register("password", {
                required: "Password is required",
                validate: (value) => {
                  if (value.length < 8) return "Must be at least 8 characters long";
                  let output = "Must contain: ";

                  return output === "Must contain: " || output;
                },
              })}
            />
            {errors.password && <span className="error-message text-red-400">{errors.password.message as string}</span>}
          </div>
          <button className="w-full py-4 bg-primary text-white rounded-full font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20">
            Authorize Entry
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLoginPage;
