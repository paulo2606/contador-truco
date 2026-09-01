"use client";

import { useInstallPrompt } from "../useInstallPrompt";
import { useTrucoGame } from "../useTrucoGame";
import { HandControls } from "./HandControls";
import { HandStatus } from "./HandStatus";
import { InstallPrompt } from "./InstallPrompt";
import { ScoreBoard } from "./ScoreBoard";
import { ServiceWorkerRegister } from "./ServiceWorkerRegister";
import { SetupForm } from "./SetupForm";
import { TopBar } from "./TopBar";
import { WinnerOverlay } from "./WinnerOverlay";

export function TrucoApp() {
  const { screen, state, canUndo, startGame, call, accept, run, winTeam, tie, undo, playAgain, newGame } =
    useTrucoGame();
  const installPrompt = useInstallPrompt();

  function handleNewGame() {
    if (state && !state.winner) {
      const confirmed = window.confirm("Encerrar a partida atual e voltar para a configuração?");
      if (!confirmed) return;
    }
    newGame();
  }

  return (
    <div className="fixed inset-0 z-20 overflow-y-auto bg-gradient-to-b from-emerald-950 to-emerald-900">
      <ServiceWorkerRegister />
      <InstallPrompt
        visible={installPrompt.visible}
        dontShowAgain={installPrompt.dontShowAgain}
        onDontShowAgainChange={installPrompt.setDontShowAgain}
        onDismiss={installPrompt.dismiss}
        onInstall={installPrompt.install}
      />
      {screen === "setup" || !state ? (
        <SetupForm onStart={startGame} extraBottomSpace={installPrompt.visible} />
      ) : (
        <div
          className={`mx-auto flex min-h-full w-full max-w-md flex-col gap-5 px-4 pt-5 transition-[padding] ${
            installPrompt.visible ? "pb-56" : "pb-5"
          }`}
        >
          <TopBar state={state} canUndo={canUndo} onUndo={undo} onNewGame={handleNewGame} />
          <ScoreBoard state={state} />
          <HandStatus state={state} />
          <HandControls state={state} onCall={call} onAccept={accept} onRun={run} onWin={winTeam} onTie={tie} />
          <WinnerOverlay state={state} onPlayAgain={playAgain} onNewGame={handleNewGame} />
        </div>
      )}
    </div>
  );
}
