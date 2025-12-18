"use client";

import { Handle, Position } from "reactflow";
import { useDebateStore } from "@/lib/store";
import { ArgumentType } from "@/lib/types";

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

  const handleVote = (increment: number) => {
    updateArgument(id, { votes: data.votes + increment });
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
          <button
            onClick={() => deleteArgument(id)}
            className="text-white/50 hover:text-white text-xs"
          >
            ✕
          </button>
        </div>

        <div className="text-sm mb-3 leading-relaxed">{data.content}</div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleVote(1)}
            className="px-2 py-1 bg-white/20 hover:bg-white/30 rounded text-xs"
          >
            👍
          </button>
          <span className="text-sm font-bold">{data.votes}</span>
          <button
            onClick={() => handleVote(-1)}
            className="px-2 py-1 bg-white/20 hover:bg-white/30 rounded text-xs"
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
