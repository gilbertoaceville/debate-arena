export type ArgumentType = 'claim' | 'evidence' | 'counter' | 'question';

export type RelationType = 'supports' | 'refutes' | 'questions' | 'assumes';

export interface ArgumentData {
  id: string;
  type: ArgumentType;
  content: string;
  author: string;
  createdAt: number;
  votes: number;
  fallacies?: string[];
}

export interface ArgumentRelation {
  id: string;
  source: string;
  target: string;
  type: RelationType;
  strength: number;
}

export interface DebateState {
  arguments: Record<string, ArgumentData>;
  relations: Record<string, ArgumentRelation>;
  addArgument: (arg: Omit<ArgumentData, 'id' | 'createdAt'>) => void;
  addRelation: (rel: Omit<ArgumentRelation, 'id'>) => void;
}