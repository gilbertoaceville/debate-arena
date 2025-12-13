'use client';

import React, { useCallback } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  MarkerType,
} from 'reactflow';

const ArgumentNode = ({ data }: { data: { label: string; type: 'claim' | 'evidence' | 'counter' } }) => {
  const typeColors = {
    claim: 'bg-blue-500',
    evidence: 'bg-green-500',
    counter: 'bg-red-500',
  };

  return (
    <div className={`px-4 py-3 rounded-lg shadow-lg ${typeColors[data.type]} text-white min-w-50`}>
      <div className="text-xs font-semibold uppercase mb-1 opacity-75">
        {data.type}
      </div>
      <div className="text-sm font-medium">
        {data.label}
      </div>
    </div>
  );
};

const nodeTypes = {
  argument: ArgumentNode,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'argument',
    position: { x: 250, y: 50 },
    data: { 
      label: 'AI will replace programmers',
      type: 'claim'
    },
  },
  {
    id: '2',
    type: 'argument',
    position: { x: 200, y: 200 },
    data: { 
      label: 'GitHub Copilot writes 40% of code',
      type: 'evidence'
    },
  },
  {
    id: '3',
    type: 'argument',
    position: { x: 250, y: 350 },
    data: { 
      label: "AI can't understand business requirements",
      type: 'counter'
    },
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    label: 'supports',
    type: 'smoothstep',
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
    style: { stroke: '#10b981', strokeWidth: 2 },
    labelStyle: { fill: '#10b981', fontWeight: 600 },
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    label: 'refutes',
    type: 'smoothstep',
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
    style: { stroke: '#ef4444', strokeWidth: 2 },
    labelStyle: { fill: '#ef4444', fontWeight: 600 },
  },
];

export default function DebateArena() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="w-full h-screen bg-gray-900">
      <div className="absolute top-4 left-4 z-10 bg-gray-800 text-white p-4 rounded-lg shadow-xl max-w-md">
        <h1 className="text-xl font-bold mb-2">🏛️ Debate Arena - Phase 1.1</h1>
        <p className="text-sm text-gray-300">
          <strong>Try this:</strong> Drag nodes around, zoom with mouse wheel, pan by dragging the canvas.
        </p>
        <div className="mt-3 text-xs text-gray-400">
          <div>🔵 Claim - Main argument</div>
          <div>🟢 Evidence - Supporting fact</div>
          <div>🔴 Counter - Refutation</div>
        </div>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
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
  );
}