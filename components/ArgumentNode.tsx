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
    aiAnalysis?: {
      strength: number;
      fallacies: string[];
      feedback: string;
    };
    isAnalyzing?: boolean;
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
    const { updateArgument, deleteArgument, analyzeArgument } = useDebateStore();
  const config = typeConfig[data.type];

  const [isEditing, setIsEditing] = useState(false);
  const [editDraft, setEditDraft] = useState("");
  const [showAnalysis, setShowAnalysis] = useState(false);
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

  const handleAnalyze = () => {
    analyzeArgument(id);
  };

  const getStrengthColor = (strength: number) => {
    if (strength >= 75) return "text-green-400";
    if (strength >= 50) return "text-yellow-400";
    return "text-red-400";
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
          <div>
            <div
              className="text-sm mb-3 leading-relaxed cursor-pointer hover:bg-white/5 rounded p-1 -m-1 transition-colors"
              onClick={startEditing}
              title="Click to edit"
            >
              {data.content}
            </div>

            {data.aiAnalysis && (
              <div className="mb-3 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <div
                    className={`text-xs font-bold ${getStrengthColor(
                      data.aiAnalysis.strength
                    )}`}
                  >
                    Strength: {data.aiAnalysis.strength}/100
                  </div>
                  {data.aiAnalysis.fallacies.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {data.aiAnalysis.fallacies.map((fallacy, i) => (
                        <span
                          key={i}
                          className="bg-red-500/20 text-red-300 px-2 py-0.5 rounded text-xs"
                        >
                          ⚠️ {fallacy}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {showAnalysis && (
                  <div className="bg-white/10 rounded p-2 text-xs">
                    {data.aiAnalysis.feedback}
                  </div>
                )}
                <button
                  onClick={() => setShowAnalysis(!showAnalysis)}
                  className="text-xs text-white/60 hover:text-white transition-colors"
                >
                  {showAnalysis ? "▼ Hide" : "▶ Show"} Analysis
                </button>
              </div>
            )}
          </div>
        )}

        <div className="space-y-2">
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

          <button
            onClick={handleAnalyze}
            disabled={data.isAnalyzing}
            className="w-full bg-purple-600/30 hover:bg-purple-600/50 disabled:bg-gray-600/30 rounded px-3 py-1.5 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
          >
            {data.isAnalyzing ? (
              <>
                <span className="animate-spin">⚡</span>
                Analyzing...
              </>
            ) : (
              <>
                <span>🤖</span>
                {data.aiAnalysis ? "Re-analyze" : "Analyze with AI"}
              </>
            )}
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
