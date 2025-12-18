import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { DebateState } from "./types";

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

      try {
        const argument = useDebateStore.getState().arguments[id];
        if (!argument) return;

        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            argumentType: argument.type,
            content: argument.content
          })
        });

        if (!response.ok) {
          throw new Error('Failed to analyze argument');
        }

        const data = await response.json();
        
        let analysisText = '';
        for (const block of data.content) {
          if (block.type === 'text') {
            analysisText += block.text;
          }
        }

        // extract JSON from response (possibly wrapped in markdown)
        const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const analysis = JSON.parse(jsonMatch[0]);
          
          set((state) => {
            if (state.arguments[id]) {
              state.arguments[id].aiAnalysis = {
                fallacies: analysis.fallacies || [],
                strength: analysis.strength || 50,
                feedback: analysis.feedback || 'No feedback provided',
                analyzedAt: Date.now()
              };
              state.arguments[id].isAnalyzing = false;
            }
          });
        } else {
          throw new Error('Could not parse analysis response');
        }
      } catch (error) {
        console.error('Analysis error:', error);
        set((state) => {
          if (state.arguments[id]) {
            state.arguments[id].isAnalyzing = false;
            state.arguments[id].aiAnalysis = {
              fallacies: [],
              strength: 0,
              feedback: 'Analysis failed. Please try again.',
              analyzedAt: Date.now()
            };
          }
        });
      }
    },
  }))
);
