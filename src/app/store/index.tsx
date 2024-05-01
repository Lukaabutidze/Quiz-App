import { create } from "zustand";

export type configType = {
  numberOfQuestion: number;
  category: { id: number; name: string };
  level: string;
  type: string;
  status: string;
  score: number;
};

const defaultConfig = {
  numberOfQuestion: 10,
  category: {
    id: 0,
    name: "",
  },
  type: "",
  status: "",
  score: 0,
};

const useQuiz = create((set) => ({
  config: { ...defaultConfig },
  addLevel: (level: string) =>
    set((state: configType) => ({ config: { ...state.config, level: level } })),
  addNumberOfQuestions: (count: number) =>
    set((state: configType) => ({
      config: { ...state.config, numberOfQuestion: count },
    })),
  addCategory: (id: number, name: string) =>
    set((state: configType) => ({
      config: { ...state.config, category: { id: id, name: name } },
    })),
  addStatus: (status: string) =>
    set((state: configType) => ({
      config: { ...state.config, status: status },
    })),
  addScore: (score: number) =>
    set((state: configType) => ({ config: { ...state.config, score: score } })),
}));

export default useQuiz;
