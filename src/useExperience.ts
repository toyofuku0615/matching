import { useEffect, useReducer } from "react";
import { conversations } from "./data/conversations";
import type { FarmerId } from "./data/types";

export type Screen =
  | "welcome"
  | "preferences"
  | "discover"
  | "matched"
  | "chat"
  | "offer"
  | "completed";
export type Message = { id: number; from: "farmer" | "you"; text: string };
type Pending = { questionId?: string; text: string };
export type Experience = {
  screen: Screen;
  index: number;
  preference: string | null;
  matched: FarmerId | null;
  messages: Message[];
  answered: string[];
  offerUnlocked: boolean;
  pending: Pending | null;
};
type Action =
  | { type: "navigate"; screen: Screen }
  | { type: "preference"; value: string }
  | { type: "skip" }
  | { type: "match"; farmerId: FarmerId }
  | { type: "send"; pending: Pending }
  | { type: "reply" }
  | { type: "reset" };
const initial: Experience = {
  screen: "welcome",
  index: 0,
  preference: null,
  matched: null,
  messages: [],
  answered: [],
  offerUnlocked: false,
  pending: null,
};
function reducer(state: Experience, action: Action): Experience {
  switch (action.type) {
    case "navigate":
      return { ...state, screen: action.screen };
    case "preference":
      return { ...state, preference: action.value, index: 0 };
    case "skip":
      return { ...state, index: state.index + 1 };
    case "match": {
      if (state.matched === action.farmerId)
        return { ...state, screen: "matched" };
      return {
        ...state,
        screen: "matched",
        matched: action.farmerId,
        answered: [],
        offerUnlocked: false,
        pending: null,
        messages: conversations[action.farmerId].greeting.map((text, id) => ({
          id,
          from: "farmer",
          text,
        })),
      };
    }
    case "send": {
      if (
        state.pending ||
        !state.matched ||
        (action.pending.questionId &&
          state.answered.includes(action.pending.questionId))
      )
        return state;
      return {
        ...state,
        pending: action.pending,
        messages: [
          ...state.messages,
          { id: state.messages.length, from: "you", text: action.pending.text },
        ],
      };
    }
    case "reply": {
      if (!state.pending || !state.matched) return state;
      const script = conversations[state.matched];
      const question = script.questions.find(
        (q) => q.questionId === state.pending!.questionId,
      );
      const answered = question
        ? [...state.answered, question.questionId]
        : state.answered;
      const unlock = answered.length >= 2;
      const replies = question ? question.farmerResponse : [script.fallback];
      const texts =
        unlock && !state.offerUnlocked
          ? [...replies, script.invitation]
          : replies;
      return {
        ...state,
        pending: null,
        answered,
        offerUnlocked: state.offerUnlocked || unlock,
        messages: [
          ...state.messages,
          ...texts.map(
            (text, i): Message => ({
              id: state.messages.length + i,
              from: "farmer",
              text,
            }),
          ),
        ],
      };
    }
    case "reset":
      return { ...initial };
  }
}
export function useExperience() {
  const [state, dispatch] = useReducer(reducer, initial);
  useEffect(() => {
    if (!state.pending || !state.matched) return;
    const delay =
      conversations[state.matched].questions.find(
        (q) => q.questionId === state.pending!.questionId,
      )?.typingDelay ?? 750;
    const timer = window.setTimeout(() => dispatch({ type: "reply" }), delay);
    return () => window.clearTimeout(timer);
  }, [state.pending, state.matched]);
  return { state, dispatch };
}
