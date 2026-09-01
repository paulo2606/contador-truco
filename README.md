# Contador de Truco

Marcador de Truco em PWA — React + TypeScript + Next.js.

## Funcionalidades

- Variantes **Truco Paulista** e **Truco Mineiro**, cada uma com sua "mão de ouro"
  (mão de 11 no Paulista, mão de 10 no Mineiro), que força a jogada valendo truco
  e impede correr.
- Modo **Dupla (2x2)** ou **Individual (1x1)**, com nomes personalizados para os
  dois lados.
- Botão de truco com fluxo completo: pedir → aceitar / correr / aumentar
  (1 → 3 → 6 → 9 → 12).
- Indicador de quem está "a mão" (quem joga por último na rodada).
- Placar limitado a 12 pontos: qualquer pontuação que ultrapassaria o limite é
  cortada exatamente em 12, com tela de vencedor.
- Desfazer última jogada e placar persistido localmente (localStorage).
- Instalável como PWA e funciona offline (manifest + service worker).

## Rodando localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — ambiente de desenvolvimento
- `npm run build` — build de produção
- `npm run start` — serve o build de produção
- `npm run lint` — eslint
- `npm run typecheck` — checagem de tipos
- `npm test` — testes (Jest)
