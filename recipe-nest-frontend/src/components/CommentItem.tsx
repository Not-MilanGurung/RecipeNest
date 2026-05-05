import { useState } from "react";

export type Comment = {
  _id: string;
  text: string;
  createdAt: string;
  user?: {
    _id: string;
    name: string;
    avatar?: string;
  };
};

export default function CommentItem({
  comment,
  currentUser,
  onDelete,
  onUpdate,
}: {
  comment: Comment;
  currentUser?: { _id: string; role: string };
  onDelete: (id: string) => void;
  onUpdate: (id: string, content: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);

  const isOwner = currentUser?._id === comment.user?._id;
  const isAdmin = currentUser?.role === "admin";

  const handleUpdate = () => {
    onUpdate(comment._id, editText);
    setIsEditing(false);
  };

  return (
    <div className="py-6 border-b border-border last:border-none group">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-secondary">
            <img
              src={comment.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user?.name}`}
              alt="avatar"
            />
          </div>
          <div>
            <p className="text-sm font-bold text-neutral">{comment.user?.name}</p>
            <p className="text-[10px] text-neutral/40 uppercase font-black tracking-widest">
              {new Date(comment.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {(isOwner || isAdmin) && (
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {isOwner && (
              <button onClick={() => setIsEditing(!isEditing)} className="text-[10px] uppercase font-bold text-primary">
                Edit
              </button>
            )}
            <button onClick={() => onDelete(comment._id)} className="text-[10px] uppercase font-bold text-red-500">
              Delete
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="mt-2 space-y-2">
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full p-3 bg-secondary rounded-xl text-sm outline-none border border-primary/20"
          />
          <button onClick={handleUpdate} className="px-4 py-1 bg-primary text-white text-[10px] font-bold rounded-full uppercase">
            Update
          </button>
        </div>
      ) : (
        <p className="text-neutral/70 text-sm leading-relaxed pl-11">{comment.text}</p>
      )}
    </div>
  );
}
