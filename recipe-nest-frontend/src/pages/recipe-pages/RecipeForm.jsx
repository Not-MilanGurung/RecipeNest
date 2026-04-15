import React, { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import NavBar from '../../components/NavBar';

import useAxiosPrivate from '../../helpers/userAxiosPrivate';
import { apiRecipeCreateRoute } from '../../helpers/constants';

function RecipeForm() {
	const { register, control, handleSubmit, formState: { errors } } = useForm({
		defaultValues: {
			name: '',
			metrics: { preptime: '', cooktime: '', servings: 1 },
			ingredients: [{ name: '', unit: '', quantity: 1 }],
			steps: [''],
			description: '',
			image: null
		}
	});
	const [submitStatus, setSubmitStatus] = useState({
		success: false,
		message: ""
	});
	
	// Manage dynamic ingredients array
	const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } = useFieldArray({
		control,
		name: "ingredients"
	});
	
	// Manage dynamic steps array
	const { fields: stepFields, append: appendStep, remove: removeStep } = useFieldArray({
		control,
		name: "steps"
	});

	// Handle image selection and preview
	const [preview, setPreview] = useState(null);
	const handleImageChange = (e, onChange) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setPreview(reader.result); // For the UI preview
			};
			reader.readAsDataURL(file);
			onChange(file); // Update react-hook-form state
		}
	};

	const api = useAxiosPrivate();
	const onSubmit = async (data) => {
		try{
			setSubmitStatus({ success: false, message: ''});

			const formData = new FormData();

			// 1. Append simple strings
			formData.append('name', data.name);
			formData.append('description', data.description);

			// 2. Append the File (mapped to schema.image)
			if (data.image) {
				formData.append('image', data.image);
			}

			// 3. Handle Nested Objects and Arrays
			// Most Multer setups prefer these as stringified JSON if they are complex
			formData.append('metrics', JSON.stringify(data.metrics));
			formData.append('ingredients', JSON.stringify(data.ingredients));
			formData.append('steps', JSON.stringify(data.steps));

			await api.post(apiRecipeCreateRoute, formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			});
			setSubmitStatus({ success: true, message: "Successfully created a recipe." });

		} catch (error) {
			console.log(error);
			const errorMessage = error.response?.data?.message || "Network error. Please try again";
			setSubmitStatus({ success: false, message: errorMessage});
		}
	};

	return (
		<main className='min-h-screen bg-secondary text-neutral font-sans pb-20'>
			<NavBar />

			<form onSubmit={handleSubmit(onSubmit)} className="max-w-5xl mx-auto px-6 py-16 space-y-16">
			
			{/* Title Section */}
			<section className="space-y-4">
				<label className="text-xs font-black uppercase text-primary/40 tracking-widest">Recipe Title</label>
				<input 
					{...register("name", { required: "Name is required", maxLength: 100 })}
					placeholder="e.g. Saffron Risotto"
					className="w-full text-5xl font-bold bg-transparent border-b-2 border-primary/10 focus:border-primary outline-none py-2 transition-colors"
				/>
				{errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
			</section>

			{/* Metrics Grid */}
			<div className="grid grid-cols-3 gap-6">
				<div className="space-y-2">
					<label className="text-xs font-black text-primary/40 tracking-widest uppercase">Prep Time</label>
					<input {...register("metrics.preptime")} className="w-full p-4 bg-white rounded-2xl border border-border outline-none focus:ring-2 focus:ring-primary/20" placeholder="15 mins" />
				</div>
				<div className="space-y-2">
					<label className="text-xs font-black text-primary/40 tracking-widest uppercase">Cook Time</label>
					<input {...register("metrics.cooktime")} className="w-full p-4 bg-white rounded-2xl border border-border outline-none focus:ring-2 focus:ring-primary/20" placeholder="30 mins" />
				</div>
				<div className="space-y-2">
					<label className="text-xs font-black text-primary/40 tracking-widest uppercase">Servings</label>
					<input type="number" {...register("metrics.servings")} className="w-full p-4 bg-white rounded-2xl border border-border outline-none focus:ring-2 focus:ring-primary/20" />
				</div>
			</div>

			{/* 2. THE IMAGE FIELD */}
			<div className="relative group">
				<Controller
				control={control}
				name="image"
				render={({ field: { onChange } }) => (
					<label className={`
					h-full min-h-[350px] rounded-4xl flex flex-col items-center justify-center p-4 text-center 
					border-2 border-dashed transition-all cursor-pointer overflow-hidden
					${preview ? 'border-primary' : 'border-primary/20 bg-primary-muted hover:bg-primary/5'}
					`}>
					{preview ? (
						<div className="relative w-full h-full">
						<img 
							src={preview} 
							alt="Preview" 
							className="w-full h-full object-cover rounded-[1.8rem]" 
						/>
						<div className="absolute inset-0 bg-neutral/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-[1.8rem]">
							<span className="text-white font-bold text-sm bg-primary px-4 py-2 rounded-full">Change Image</span>
						</div>
						</div>
					) : (
						<>
						<div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
							<span className="text-primary text-2xl">
							<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
							</svg>
							</span>
						</div>
						<p className="text-sm font-bold text-primary uppercase tracking-tighter">Upload Hero Capture</p>
						<p className="text-xs text-primary/40 mt-2 px-6 italic">Drag and drop or click to select</p>
						</>
					)}
					
					{/* Hidden Input */}
					<input 
						type="file" 
						accept="image/*"
						className="hidden"
						onChange={(e) => handleImageChange(e, onChange)}
					/>
					</label>
				)}
				/>
			</div>

			{/* Dynamic Ingredients Section */}
			<section className="bg-secondary text-neutral p-10 rounded-[3rem] shadow-2xl">
			<div className="flex justify-between items-center mb-8">
				<h2 className="text-3xl font-bold">Mise en Place</h2>
				<button 
				type="button"
				onClick={() => appendIngredient({ name: '', unit: '', quantity: 1 })}
				className="text-xs font-bold uppercase tracking-widest bg-white/90 px-4 py-2 rounded-full hover:bg-white/80 transition-colors"
				>
				+ Add Ingredient
				</button>
			</div>

			<div className="space-y-4">
				{ingredientFields.map((field, index) => (
				<div key={field.id} className="flex gap-4 items-center">
					<input 
						type="number" 
						{...register(`ingredients.${index}.quantity`)} 
						placeholder="Qty" 
						className="w-20 bg-white/95 border border-white/90 p-4 rounded-xl focus:bg-white/90 outline-none" 
					/>
					<input 
						{...register(`ingredients.${index}.unit`)} 
						placeholder="Unit" 
						className="w-32 bg-white/95 border border-white/90 p-4 rounded-xl focus:bg-white/90 outline-none" 
					/>
					<input 
						{...register(`ingredients.${index}.name`)} 
						placeholder="Ingredient" 
						className="grow bg-white/95 border border-white/90 p-4 rounded-xl focus:bg-white/90 outline-none" 
					/>
					<button type="button" onClick={() => removeIngredient(index)} className="text-white/70 hover:text-red-400 font-bold px-2">✕</button>
				</div>
				))}
			</div>
			</section>

			{/* Dynamic Steps Section */}
			<section className="space-y-8">
			<h2 className="text-3xl font-bold text-center">The Execution</h2>
			<div className="space-y-6">
				{stepFields.map((field, index) => (
				<div key={field.id} className="flex items-start gap-8 bg-white p-8 rounded-4xl border border-border group">
					<span className="text-5xl font-black text-primary/10 group-focus-within:text-primary/30 transition-colors">{index + 1}</span>
					<textarea 
					{...register(`steps.${index}`)}
					className="grow bg-transparent text-lg outline-none resize-none pt-2" 
					placeholder="What is the next movement?"
					rows={2}
					/>
					<button type="button" onClick={() => removeStep(index)} className="text-neutral/20 hover:text-red-500">Remove</button>
				</div>
				))}
			</div>
			<div className="flex justify-center">
				<button 
				type="button"
				onClick={() => appendStep('')}
				className="border-2 border-primary text-primary font-bold px-10 py-4 rounded-full hover:bg-primary hover:text-white transition-all"
				>
				Append New Step
				</button>
			</div>
			</section>

			{/* Description / Story Section */}
			<section className="space-y-4">
			<label className="text-xs font-black uppercase text-primary/40 tracking-widest">The Story (Description)</label>
			<textarea 
				{...register("description", { required: "A description is required" })}
				placeholder="Share the inspiration behind this masterpiece..."
				className="w-full p-8 bg-white rounded-4xl border border-border outline-none focus:ring-2 focus:ring-primary/20 italic text-lg"
				rows={5}
			/>
			{errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
			</section>

			{submitStatus.message && (
				<div className={`p-3 mb-4 rounded ${submitStatus.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
					{submitStatus.message}
				</div>
			)}
			<div className="flex justify-center">
				<button 
					type="submit"
					className="border-2 border-primary text-primary font-bold px-10 py-4 rounded-full hover:bg-primary hover:text-white transition-all"
				>
				Submit
				</button>
			</div>
		</form>
		</main>
	);
};

export default RecipeForm;