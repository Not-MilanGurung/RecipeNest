import { Link, NavLink } from "react-router";
import { useForm } from 'react-hook-form';

function LoginPage() {
	const {register, handleSubmit, formState: {errors}} = useForm({mode: 'onChange'});


	const onSubmit = (e) => {
		console.log(e);
	}

	return (
		<main className="flex w-screen h-screen">
			<div className="w-6/10 bg-primary text-secondary p-10">
				<div className="text-3xl">RecipeNest</div>
				<div className="text-7xl font-bold pr-20">A community to share culinary recipes</div>
			</div>
			{/* Form */}
			<form onSubmit={handleSubmit(onSubmit)} 
				className="flex-row w-4/10 h-full content-center justify-center bg-secondary  px-35 py-10 space-y-4 text-neutral">
				{/* Form Title */}
				<div className="text-3xl text-neutral font-semibold">Welcome Back</div>

				{/* Email Field */}
				<div>
					<label className="text-primary">
						Email Address
						<br />
						<input type="email" name="email" 
							className="bg-neutral/5 w-full h-10"
							{...register('email', {
								required: 'Email is required',
								pattern: {
									value: /\S+@\S+\.\S+/,
									message: 'Email is invalid'
								}
							})}
							/>
						{errors.email && (
							<span className='error-message text-red-400'>{errors.email.message}</span>
						)}
					</label>
				</div>
				{/* Email Field End */}

				{/* Password Field */}
				<div>
					<label className="text-primary">
						Password
						<br />
						<input type="password" name="password" 
							className="bg-neutral/5 w-full h-10"
							{...register('password', {
								required: 'Password is required',
								validate: (value) => {

									if (value.length < 8) return "Must be at least 8 characters long";
									let output = 'Must contain: ';
									
									console.log(output);
									return output === '' || output;
								}
							})}
							/>
							{errors.password && (
								<span className='error-message text-red-400'>{errors.password.message}</span>
							)}
					</label>
				</div>
				{/* Passowrd Field End */}

				{/* Remember and Forgot Password Fields */}
				<div className="flex justify-between">
					{/* Remember Me Checkbox */}
					<div>
						<label className="flex items-center">
							<input type="checkbox" name="remember"
								className="w-4 h-4 mr-2"
								{...register('rememberme')}
								/>
							Remember me
						</label>
					</div>
					{/* Remember Me Checkbox End */}

					<Link to="/forgot" className="text-red-400">Forgot Password?</Link>
				</div>
				{/* Rember and Forgot Password Fields */}

				{/* Submit Button */}
				<input type="submit" value="Submit" className="w-full h-10 text-secondary bg-primary px-4 py-1 cursor-pointer hover:bg-neutral/75" />

				<div>
					New to the website? <NavLink to="/register" className="text-primary">Sign Up</NavLink>
				</div>
			</form>
		</main>
	)
}

export default LoginPage