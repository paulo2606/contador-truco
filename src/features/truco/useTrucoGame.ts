"use client";

import { useCallback, useEffect, useState } from "react";
import { STORAGE_KEY } from "./constants";
import {
  acceptCall,
  callTruco,
  createInitialState,
  resetScores,
  runFromCall,
  tieHand,
  winHand,
} from "./engine";
import { GameConfig, GameState, TeamId } from "./types";

type Screen = "setup" | "playing";

interface Persisted {
  screen: Screen;
  state: GameState | null;
}

function loadPersisted(): Persisted {
  if (typeof window === "undefined") return { screen: "setup", state: null };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { screen: "setup", state: null };
    const parsed = JSON.parse(raw) as Persisted;
    if (!parsed.state) return { screen: "setup", state: null };
    return parsed;
  } catch {
    return { screen: "setup", state: null };
  }
}

const UNDO_LIMIT = 20;

export function useTrucoGame() {
  // This hook only ever runs client-side (the route is loaded with ssr: false),
  // so it's safe to read localStorage directly in these lazy initializers.
  const [screen, setScreen] = useState<Screen>(() => loadPersisted().screen);
  const [state, setState] = useState<GameState | null>(() => loadPersisted().state);
  const [past, setPast] = useState<GameState[]>([]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ screen, state }));
  }, [screen, state]);

  const startGame = useCallback((config: GameConfig) => {
    setState(createInitialState(config));
    setPast([]);
    setScreen("playing");
  }, []);

  const mutate = useCallback((fn: (s: GameState) => GameState) => {
    setState((current) => {
      if (!current) return current;
      const next = fn(current);
      if (next !== current) {
        setPast((history) => [...history.slice(-(UNDO_LIMIT - 1)), current]);
      }
      return next;
    });
  }, []);

  const undo = useCallback(() => {
    setPast((history) => {
      if (history.length === 0) return history;
      const previous = history[history.length - 1];
      setState(previous);
      return history.slice(0, -1);
    });
  }, []);

  const call = useCallback((team: TeamId) => mutate((s) => callTruco(s, team)), [mutate]);
  const accept = useCallback(() => mutate(acceptCall), [mutate]);
  const run = useCallback(() => mutate(runFromCall), [mutate]);
  const winTeam = useCallback((team: TeamId) => mutate((s) => winHand(s, team)), [mutate]);
  const tie = useCallback(() => mutate(tieHand), [mutate]);

  const playAgain = useCallback(() => {
    setState((current) => (current ? resetScores(current) : current));
    setPast([]);
  }, []);

  const newGame = useCallback(() => {
    setState(null);
    setPast([]);
    setScreen("setup");
  }, []);

  return {
    screen,
    state,
    canUndo: past.length > 0,
    startGame,
    call,
    accept,
    run,
    winTeam,
    tie,
    undo,
    playAgain,
    newGame,
  };
}
