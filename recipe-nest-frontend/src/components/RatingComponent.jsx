import useAxiosPrivate from "../helpers/userAxiosPrivate";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";

function RatingComponent({ recipeId, ratingAverage, ratingCount }) {
  const api = useAxiosPrivate();
  const queryClient = useQueryClient();
  const [hoverRating, setHoverRating] = useState(0);

  // Fetch the current user's specific rating for this recipe
  const { data: userRatingData } = useQuery({
    queryKey: ["userRating", recipeId],
    queryFn: () => api.get(`/recipes/${recipeId}/rating`).then(res => res.data.data.rating),
    retry: false // Don't retry if 404 (user hasn't rated yet)
  });

  const { mutate } = useMutation({
    mutationFn: (value) => api.post(`/recipes/${recipeId}/rating`, { rating: value }),
    onSuccess: () => {
      // Refresh both the recipe stats and the user's personal rating
      queryClient.invalidateQueries(["recipe", recipeId]);
      queryClient.invalidateQueries(["userRating", recipeId]);
    },
  });

  // Priority: 1. Hover state | 2. User's saved rating | 3. Global average
  const activeStars = hoverRating || userRatingData?.value || 0;

  return (
    <div className="space-y-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
  <button
    key={star}
    type="button" // <--- CRITICAL: Prevents form submission
    onMouseEnter={() => setHoverRating(star)}
    onMouseLeave={() => setHoverRating(0)}
    onClick={() => mutate(star)}
    className={`text-2xl transition-transform hover:scale-110 ${
      star <= activeStars ? "text-yellow-400" : "text-gray-300"
    }`}
  >
    ★
  </button>
))}
      </div>
      <p className="text-xs text-gray-500">
        {ratingCount} ratings ({ratingAverage.toFixed(1)} avg)
      </p>
    </div>
  );
}

export default RatingComponent;