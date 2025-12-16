import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { DebateState } from "./types";

export const useDebateStore = create<DebateState>()(
  immer((set) => ({
    arguments: {},
    relations: {},

    addArgument: (arg) =>
      set((state) => {
        const id = `arg_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`;
        state.arguments[id] = {
          ...arg,
          id,
          createdAt: Date.now(),
          votes: 0,
        };
      }),

    addRelation: (rel) =>
      set((state) => {
        const id = `rel_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`;
        state.relations[id] = {
          ...rel,
          id,
        };
      }),
  }))
);
