import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { ArgumentType, RelationType } from "./types";

export interface ArgumentData {
  id: string;
  type: ArgumentType;
  content: string;
  author: string;
  createdAt: number;
  votes: number;
}

export interface ArgumentRelation {
  id: string;
  source: string;
  target: string;
  type: RelationType;
}

interface DebateState {
  arguments: Record<string, ArgumentData>;
  relations: Record<string, ArgumentRelation>;
  addArgument: (type: ArgumentType, content: string) => string;
  addRelation: (source: string, target: string, type: RelationType) => void;
  updateArgument: (id: string, updates: Partial<ArgumentData>) => void;
  deleteArgument: (id: string) => void;
}

export const useDebateStore = create<DebateState>()(
  immer((set) => ({
    arguments: {
      "1": {
        id: "1",
        type: "claim",
        content: "AI will significantly change software development",
        author: "User",
        createdAt: Date.now(),
        votes: 0,
      },
    },
    relations: {},

    addArgument: (type, content) => {
      let newId = "";
      set((state) => {
        const id = `arg_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`;
        newId = id;
        state.arguments[id] = {
          id,
          type,
          content,
          author: "User",
          createdAt: Date.now(),
          votes: 0,
        };
      });
      return newId;
    },

    addRelation: (source, target, type) =>
      set((state) => {
        const id = `rel_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`;
        state.relations[id] = { id, source, target, type };
      }),

    updateArgument: (id, updates) =>
      set((state) => {
        if (state.arguments[id]) {
          Object.assign(state.arguments[id], updates);
        }
      }),

    deleteArgument: (id) =>
      set((state) => {
        delete state.arguments[id];
        Object.keys(state.relations).forEach((relId) => {
          const rel = state.relations[relId];
          if (rel.source === id || rel.target === id) {
            delete state.relations[relId];
          }
        });
      }),
  }))
);
