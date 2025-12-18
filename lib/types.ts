export type ArgumentType = 'claim' | 'evidence' | 'counter' | 'question';

export type RelationType = 'supports' | 'refutes' | 'questions' | 'assumes';

export interface ArgumentData {
  id: string;
  type: ArgumentType;
  content: string;
  author: string;
  createdAt: number;
  votes: number;
  aiAnalysis?: {
    fallacies: string[];
    strength: number; // 0-100
    feedback: string;
    analyzedAt: number;
  };
  isAnalyzing?: boolean;
}

export interface ArgumentRelation {
  id: string;
  source: string;
  target: string;
  type: RelationType;
}

export interface DebateState {
  arguments: Record<string, ArgumentData>;
  relations: Record<string, ArgumentRelation>;
  addArgument: (type: ArgumentType, content: string) => string;
  addRelation: (source: string, target: string, type: RelationType) => void;
  updateArgument: (id: string, updates: Partial<ArgumentData>) => void;
  deleteArgument: (id: string) => void;
}