import type { UseMutationResult } from "@tanstack/react-query";
import { Link } from "react-router";

export type Recipe = {
  _id: string,
  name: string,
  chef: {
    name: string,
  },
  flagged: boolean,
}

export default function AdminRecipeListItem({
  recipe,
  handleToggleFlag,
  flagMutation,
}: {
  recipe: Recipe;
  handleToggleFlag: (id: string, currentStatus: boolean) => void;
  flagMutation: UseMutationResult<any, Error, { id: string; flagged: boolean }, unknown>;
}) {
  return (
    <tr key={recipe._id} className="group hover:bg-secondary/30 transition-colors">
      <td className="px-8 py-6">
        <p className="font-bold">
          <Link to={`/recipes/${recipe._id}`}>{recipe.name}</Link>
        </p>
        <p className="text-[10px] text-neutral/40 uppercase font-black">{recipe.chef.name}</p>
      </td>
      <td className="px-8 py-6">
        {recipe.flagged ? (
          <span className="px-3 py-1 bg-red-100 text-red-600 text-[10px] font-bold rounded-full uppercase tracking-tighter">
            Flagged
          </span>
        ) : (
          <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase tracking-tighter">
            Active
          </span>
        )}
      </td>
      <td className="px-8 py-6 text-right">
        <button
          onClick={() => handleToggleFlag(recipe._id, recipe.flagged)}
          disabled={flagMutation.isPending}
          className={`
                      px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all
                      ${
                        recipe.flagged
                          ? "bg-neutral text-white hover:bg-neutral/80"
                          : "border border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                      }
                  `}
        >
          {flagMutation.isPending && flagMutation.variables?.id === recipe._id
            ? "Updating..."
            : recipe.flagged
              ? "Unflag"
              : "Flag Entry"}
        </button>
      </td>
    </tr>
  );
}

