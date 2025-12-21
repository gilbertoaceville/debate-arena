import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { DebateState } from "./types";
import { mockAnalyzeArgument } from "./utils";

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
    analyzeArgument: async (id) => {
      set((state) => {
        if (state.arguments[id]) {
          state.arguments[id].isAnalyzing = true;
        }
      });

      const argument = useDebateStore.getState().arguments[id];

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const analysis = mockAnalyzeArgument(argument.content, argument.type);

      set((state) => {
        state.arguments[id].aiAnalysis = {
          fallacies: analysis.fallacies,
          strength: analysis.strength,
          feedback: analysis.feedback,
          analyzedAt: Date.now(),
        };
      });
    },
  }))
);
