"use client";

import dynamic from "next/dynamic";

const TrucoApp = dynamic(() => import("@/features/truco/components/TrucoApp").then((m) => m.TrucoApp), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-emerald-950" />,
});

export function TrucoAppLoader() {
  return <TrucoApp />;
}
