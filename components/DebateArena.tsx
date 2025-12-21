"use client";

import React, { useCallback, useMemo, useState } from "react";
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Connection,
  MarkerType,
} from "reactflow";
import { ArgumentNode } from "@/components/ArgumentNode";
import { useDebateStore } from "@/lib/store";
import { ArgumentType, RelationType } from "@/lib/types";

const nodeTypes = {
  argument: ArgumentNode,
};

export default function DebateArena() {
  const {
    arguments: storeArgs,
    relations: storeRels,
    addArgument,
    addRelation,
  } = useDebateStore();

  const [newArgContent, setNewArgContent] = useState("");
  const [newArgType, setNewArgType] = useState<ArgumentType>("claim");
  const [connectionMode, setConnectionMode] =
    useState<RelationType>("supports");

  const nodes = useMemo(() => {
    return Object.values(storeArgs).map((arg, index) => ({
      id: arg.id,
      type: "argument",
      position: { x: 250 + index * 350, y: 100 + (index % 2) * 200 },
      data: {
        type: arg.type,
        content: arg.content,
        votes: arg.votes,
        aiAnalysis: arg.aiAnalysis,
        isAnalyzing: arg.isAnalyzing,
      },
    }));
  }, [storeArgs]);

  const edges = useMemo(() => {
    const relationColors = {
      supports: { stroke: "#10b981", label: "✓ supports" },
      refutes: { stroke: "#ef4444", label: "✗ refutes" },
      questions: { stroke: "#f59e0b", label: "? questions" },
      assumes: { stroke: "#8b5cf6", label: "⊃ assumes" },
    };

    return Object.values(storeRels).map((rel) => ({
      id: rel.id,
      source: rel.source,
      target: rel.target,
      label: relationColors[rel.type].label,
      type: "smoothstep",
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: relationColors[rel.type].stroke, strokeWidth: 2 },
      labelStyle: {
        fill: relationColors[rel.type].stroke,
        fontWeight: 600,
        fontSize: 12,
      },
    }));
  }, [storeRels]);

  const [flowNodes, setNodes, onNodesChange] = useNodesState(nodes);
  const [flowEdges, setEdges, onEdgesChange] = useEdgesState(edges);

  React.useEffect(() => {
    setNodes(nodes);
  }, [nodes, setNodes]);

  React.useEffect(() => {
    setEdges(edges);
  }, [edges, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => {
      if (params.source && params.target) {
        addRelation(params.source, params.target, connectionMode);
      }
    },
    [addRelation, connectionMode]
  );

  const handleAddArgument = () => {
    if (newArgContent.trim()) {
      addArgument(newArgType, newArgContent.trim());
      setNewArgContent("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleAddArgument();
    }
  };

  return (
    <div className="w-full h-screen bg-gray-900 flex">
      <div className="w-80 bg-gray-800 border-r border-gray-700 p-4 overflow-y-auto">
        <h1 className="text-2xl font-bold text-white mb-4">🏛️ Debate Arena</h1>

        <div className="bg-gray-700 rounded-lg p-3 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Arguments:</span>
            <span className="text-white font-semibold">
              {Object.keys(storeArgs).length}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Relations:</span>
            <span className="text-white font-semibold">
              {Object.keys(storeRels).length}
            </span>
          </div>
        </div>

        <div className="bg-gray-700 rounded-lg p-4 mb-4">
          <h2 className="text-white font-semibold mb-3">Add Argument</h2>

          <select
            value={newArgType}
            onChange={(e) => setNewArgType(e.target.value as ArgumentType)}
            className="w-full bg-gray-600 text-white rounded px-3 py-2 mb-2"
          >
            <option value="claim">💡 Claim</option>
            <option value="evidence">📊 Evidence</option>
            <option value="counter">❌ Counter</option>
            <option value="question">❓ Question</option>
          </select>

          <textarea
            value={newArgContent}
            onChange={(e) => setNewArgContent(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Enter your argument..."
            className="w-full bg-gray-600 text-white rounded px-3 py-2 mb-2 resize-none"
            rows={3}
          />

          <button
            onClick={handleAddArgument}
            disabled={!newArgContent.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded px-4 py-2 font-semibold transition-colors"
          >
            Add Argument
          </button>
        </div>

        <div className="bg-gray-700 rounded-lg p-4 mb-4">
          <h2 className="text-white font-semibold mb-3">Connection Mode</h2>
          <p className="text-gray-400 text-xs mb-2">
            Drag from a node&apos;s bottom handle to another node&apos;s top
            handle
          </p>

          <div className="space-y-2">
            {(
              ["supports", "refutes", "questions", "assumes"] as RelationType[]
            ).map((type) => (
              <button
                key={type}
                onClick={() => setConnectionMode(type)}
                className={`w-full px-3 py-2 rounded text-sm font-medium transition-colors ${
                  connectionMode === type
                    ? "bg-blue-600 text-white"
                    : "bg-gray-600 text-gray-300 hover:bg-gray-500"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gray-700 rounded-lg p-4">
          <h2 className="text-white font-semibold mb-2">How to Use</h2>
          <ul className="text-gray-300 text-xs space-y-1 italic">
            <li>• Add arguments with the form above</li>
            <li>• Drag nodes to arrange them</li>
            <li>• Select connection type</li>
            <li>• Drag from bottom to top handle</li>
            <li>• Vote with 👍 👎 buttons</li>
            <li>• Delete with ✕ button</li>
          </ul>
          <div className="mt-3 pt-3 border-t border-gray-600">
            <p className="text-xs text-gray-400 italic">
              <strong>Keyboard shortcuts:</strong>
              <br />
              Ctrl+Enter: Save edit or add argument
              <br />
              Esc: Cancel edit
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-600">
            <p className="text-xs text-purple-300 italic">
              <strong>🤖 AI Analysis:</strong>
              <br />
              Uses HuggingFace AI when available, falls back to mock analysis.
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Check console to see which mode is active.
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 relative">
        <ReactFlow
          nodes={flowNodes}
          edges={flowEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="bg-gray-900"
        >
          <Background color="#374151" gap={16} />
          <Controls className="bg-gray-800 border border-gray-700" />
        </ReactFlow>
      </div>
    </div>
  );
}
