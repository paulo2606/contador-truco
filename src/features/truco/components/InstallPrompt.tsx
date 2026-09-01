interface InstallPromptProps {
  visible: boolean;
  dontShowAgain: boolean;
  onDontShowAgainChange: (value: boolean) => void;
  onDismiss: () => void;
  onInstall: () => void;
}

export function InstallPrompt({
  visible,
  dontShowAgain,
  onDontShowAgainChange,
  onDismiss,
  onInstall,
}: InstallPromptProps) {
  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 flex justify-center px-4 pb-4">
      <div className="w-full max-w-md rounded-2xl border border-amber-400/60 bg-emerald-900/95 p-4 text-emerald-50 shadow-2xl backdrop-blur">
        <p className="text-sm font-semibold text-white">Instalar o Contador de Truco</p>
        <p className="mt-1 text-sm text-emerald-200">
          Instale na tela inicial para abrir mais rápido e jogar offline.
        </p>
        <label className="mt-3 flex items-center gap-2 text-xs text-emerald-300">
          <input
            type="checkbox"
            checked={dontShowAgain}
            onChange={(event) => onDontShowAgainChange(event.target.checked)}
            className="h-4 w-4 rounded border-emerald-600 bg-emerald-950 accent-amber-400"
          />
          Não mostrar novamente
        </label>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-xl border border-emerald-700 px-3 py-2 text-sm font-semibold text-emerald-100 transition hover:border-emerald-500"
          >
            Agora não
          </button>
          <button
            type="button"
            onClick={onInstall}
            className="rounded-xl bg-amber-400 px-3 py-2 text-sm font-bold text-emerald-950 transition hover:bg-amber-300"
          >
            Instalar
          </button>
        </div>
      </div>
    </div>
  );
}
