import { Handle, Position } from "reactflow";
import { useDebateStore } from "@/lib/store";
import { ArgumentType } from "@/lib/types";
import { useEffect, useRef, useState } from "react";

interface ArgumentNodeProps {
  id: string;
  data: {
    type: ArgumentType;
    content: string;
    votes: number;
  };
}

const typeConfig = {
  claim: {
    color: "bg-blue-600",
    border: "border-blue-400",
    icon: "💡",
  },
  evidence: {
    color: "bg-green-600",
    border: "border-green-400",
    icon: "📊",
  },
  counter: {
    color: "bg-red-600",
    border: "border-red-400",
    icon: "❌",
  },
  question: {
    color: "bg-yellow-600",
    border: "border-yellow-400",
    icon: "❓",
  },
};

export function ArgumentNode({ id, data }: ArgumentNodeProps) {
  const { updateArgument, deleteArgument } = useDebateStore();
  const config = typeConfig[data.type];

  const [isEditing, setIsEditing] = useState(false);
  const [editDraft, setEditDraft] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const handleVote = (increment: number) => {
    updateArgument(id, { votes: data.votes + increment });
  };

  const startEditing = () => {
    setEditDraft(data.content);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editDraft.trim() && editDraft !== data.content) {
      updateArgument(id, { content: editDraft.trim() });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <div
      className={`${config.color} rounded-lg shadow-xl border-2 ${config.border} min-w-62.5 max-w-75`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-gray-300!"
      />

      <div className="p-4 text-white">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">{config.icon}</span>
            <span className="text-xs font-bold uppercase opacity-75">
              {data.type}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {!isEditing && (
              <button
                onClick={startEditing}
                className="text-white/50 hover:text-white text-xs transition-colors px-1"
                title="Edit"
              >
                ✏️
              </button>
            )}
            <button
              onClick={() => deleteArgument(id)}
              className="text-white/50 hover:text-white text-xs transition-colors px-1"
              title="Delete"
            >
              ✕
            </button>
          </div>
        </div>

        {isEditing ? (
          <div className="mb-3">
            <textarea
              ref={textareaRef}
              value={editDraft}
              onChange={(e) => setEditDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-white/10 text-white rounded px-2 py-1 text-sm resize-none border border-white/20 focus:border-white/40 focus:outline-none"
              rows={3}
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleSave}
                className="flex-1 bg-white/20 hover:bg-white/30 rounded px-2 py-1 text-xs font-semibold transition-colors"
              >
                Save (Ctrl+Enter)
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 bg-white/10 hover:bg-white/20 rounded px-2 py-1 text-xs transition-colors"
              >
                Cancel (Esc)
              </button>
            </div>
          </div>
        ) : (
          <div
            className="text-sm mb-3 leading-relaxed cursor-pointer hover:bg-white/5 rounded p-1 -m-1 transition-colors"
            onClick={startEditing}
            title="Click to edit"
          >
            {data.content}
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleVote(1)}
            className="px-2 py-1 bg-white/20 hover:bg-white/30 rounded text-xs transition-colors"
          >
            👍
          </button>
          <span className="text-sm font-bold">{data.votes}</span>
          <button
            onClick={() => handleVote(-1)}
            className="px-2 py-1 bg-white/20 hover:bg-white/30 rounded text-xs transition-colors"
          >
            👎
          </button>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-gray-300!"
      />
    </div>
  );
}
