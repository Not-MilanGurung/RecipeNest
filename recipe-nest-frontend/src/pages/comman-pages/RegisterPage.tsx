import { useForm, useWatch, type FieldValues } from "react-hook-form";
import { NavLink, useNavigate } from "react-router";
import { useContext, useState } from "react";
import { UserContext, api, constants} from '../../helpers';


function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({ mode: "onChange" });
  const [submitStatus, setSubmitStatus] = useState({
    success: false,
    message: "",
  });
  const password = useWatch({
    control,
    name: "password",
  });
  // const passwordRegex = "(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}";
  const navigate = useNavigate();
  const userContext = useContext(UserContext);

  const onSubmit = async (e: FieldValues) => {
    try {
      setSubmitStatus({ success: false, message: "" });
      const data = JSON.stringify(e);
      const response = await api.post(constants.apiRegisterRoute, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      userContext.setData({
        user: response.data.data.user,
        accessToken: response.data.data.accessToken,
      });
      setSubmitStatus({
        success: true,
        message: "Successfully created an account.",
      });
      setTimeout(() => navigate("/"), 500);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Network error. Please try again";
      setSubmitStatus({ success: false, message: errorMessage });
    }
  };

  return (
    <main className="flex w-screen h-screen">
      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex-row w-4/10 h-full content-center justify-center bg-secondary  px-35 py-10 space-y-4 text-neutral"
      >
        {/* Form Title */}
        <div className="text-3xl text-neutral font-semibold">Register</div>

        {submitStatus.message && (
          <div className={`p-3 mb-4 rounded ${submitStatus.success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {submitStatus.message}
          </div>
        )}

        {/* Username Field */}
        <div>
          <label>
            Username
            <input
              type="text"
              className="w-full h-10 bg-neutral/5 py-2 px-2"
              {...register("name", {
                required: "Username is required",
              })}
            />
            <br />
            {errors.username && <span className="error-message">{errors.username.message as string}</span>}
          </label>
        </div>
        {/* Username Field End */}

        {/* Role Field */}
        <div>
          <label>
            Role
            <select
              defaultValue={constants.roles.FOODIE}
              className="w-full h-10 bg-neutral/5 py-2 px-2"
              {...register("role", {
                required: "Role is required",
              })}
            >
              <option value={constants.roles.FOODIE}>Foodie</option>
              <option value={constants.roles.CHEF}>Chef</option>
            </select>
          </label>
        </div>

        {/* Email Field */}
        <div>
          <label>
            Email Address
            <input
              type="email"
              className="w-full h-10 bg-neutral/5 py-2 px-2 "
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Email is invalid",
                },
              })}
            />
            <br />
            {errors.email && <span className="error-message text-red-600">{errors.email.message as string}</span>}
          </label>
        </div>
        {/* Email Field End */}

        {/* Password Field */}
        <div>
          <label>
            Password
            <input
              type="password"
              id="password"
              className="w-full py-2 px-2 h-10 bg-neutral/5"
              {...register("password", {
                required: "Password is required",
                validate: (value) => {
                  if (value.length < 8) return "Must be at least 8 characters long";
                  let output = "Must contain: ";

                  const doesNotContainLowerCharacter = !value.match(/[a-z]/g);
                  if (doesNotContainLowerCharacter) output += " small letter,";

                  const doesNotContainCapitalLetter = !value.match(/[A-Z]/g);
                  if (doesNotContainCapitalLetter) output += " capital letter,";

                  const doesNotContainNumbers = !value.match(/[0-9]/g);
                  if (doesNotContainNumbers) output += " number (0-9), ";

                  return output === "Must contain: " || output;
                },
              })}
            />
            <br />
            {errors.password && <span className="error-message text-red-600">{errors.password.message as string}</span>}
          </label>
        </div>
        {/* Passowrd Field End */}

        {/* Password Confirm Field */}
        <div>
          <label>
            Confirm Password
            <input
              type="password"
              className="w-full py-2 px-2 bg-neutral/5"
              {...register("confirmPassword", {
                required: "Confirm the above password",
                validate: (value) => value === password || "Passwords do not match",
              })}
            />
            <br />
            {errors.confirmPassword && (
              <span className="error-message text-red-500">{errors.confirmPassword.message as string}</span>
            )}
          </label>
        </div>
        {/* Passowrd Field End */}

        {/* Terms of Service */}
        <div>
          <label>
            <input
              type="checkbox"
              className="w-4 h-4 mr-2"
              {...register("terms", {
                required: "You must agree with the terms of service",
              })}
            />
            I agree with to &nbsp;
            <NavLink to="/terms-of-service" className="text-primary">
              Terms of Service
            </NavLink>
            <br />
            {errors.terms && <span className="error-message text-red-500">{errors.terms.message as string}</span>}
          </label>
        </div>

        {/* Submit Button */}
        <input
          type="submit"
          value="Submit"
          className="text-secondary bg-primary w-full h-10 px-4 py-1 cursor-pointer hover:bg-neutral/75"
        />
      </form>

      <div className="w-6/10 bg-primary text-secondary p-10">
        <div className="text-3xl">RecipeNest</div>
        <div className="text-7xl font-bold pr-20">A community to share culinary recipes</div>
      </div>
    </main>
  );
}

export default RegisterPage;
