import { useState } from "react";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import api from "../helpers/api";
import CommentItem, { type Comment } from "./CommentItem";
import privateAPi from "../helpers/userAxiosPrivate";
import { type AxiosResponse } from "axios";

export default function CommentSection({
  recipeId,
  currentUser,
}: {
  recipeId: string;
  currentUser?: { _id: string; role: string };
}) {
  const [commentText, setCommentText] = useState("");
  const queryClient = useQueryClient();
  const authAPI = privateAPi();

  // Fetch comments
  const { data: comments = [], isLoading } = useQuery({
    queryKey: ["comments", recipeId],
    queryFn: () => api.get(`/recipes/${recipeId}/comments`).then((res) => res.data.data.comments),
  });

  // Create mutation
  const createMutation = useMutation<AxiosResponse, Error, string>({
    mutationFn: (content) =>
      authAPI.post(`/recipes/${recipeId}/comments`, { content }).then((res) => {
        console.log("Creating");
        return res;
      }),
    onSuccess: () => {
      setCommentText("");
      queryClient.invalidateQueries({ queryKey: ["comments", recipeId] });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation<AxiosResponse, Error, string>({
    mutationFn: (commentId) => authAPI.delete(`/recipes/comments/${commentId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["comments", recipeId] }),
  });

  // Update mutation
  const updateMutation = useMutation<AxiosResponse, Error, { id: string; content: string }>({
    mutationFn: ({ id, content }) => authAPI.put(`/recipes/comments/${id}`, { content }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["comments", recipeId] }),
  });

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    createMutation.mutate(commentText);
  };

  return (
    <div className="mt-24 space-y-12">
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-bold tracking-tight">
          Thoughts <span className="text-primary/20 ml-2">({comments.length})</span>
        </h2>
      </div>

      {/* Comment Input */}
      {currentUser ? (
        <form onSubmit={handleSubmit} className="relative">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Share your culinary notes..."
            className="w-full bg-white border border-border p-6 rounded-3xl min-h-30 outline-none focus:ring-2 focus:ring-primary/10 transition-all text-neutral"
          />
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="absolute bottom-4 right-4 px-8 py-2 bg-neutral text-white rounded-full font-bold text-xs uppercase tracking-widest hover:bg-primary transition-colors"
          >
            Post Thought
          </button>
        </form>
      ) : (
        <p className="p-6 bg-secondary rounded-3xl text-sm italic text-neutral/40">Please login to join the conversation.</p>
      )}

      {/* List */}
      <div className="space-y-2">
        {isLoading ? (
          <p className="text-sm italic">Loading conversation...</p>
        ) : comments.length > 0 ? (
          comments.map((c: Comment) => (
            <CommentItem
              key={c._id}
              comment={c}
              currentUser={currentUser}
              onDelete={(id: string) => deleteMutation.mutate(id)}
              onUpdate={(id: string, content: string) => updateMutation.mutate({ id, content })}
            />
          ))
        ) : (
          <p className="text-neutral/40 text-sm italic">No thoughts yet. Be the first to share.</p>
        )}
      </div>
    </div>
  );
}
