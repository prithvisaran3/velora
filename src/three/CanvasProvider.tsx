"use client";

/**
 * The gate in front of the one WebGL context.
 *
 * This module is reachable from the root layout, so it must stay free of
 * `three` — it decides the tier, waits for LCP and then *dynamically* pulls
 * ThreeRoot, which is where the renderer and every scene live. On `low`, or
 * with reduced motion, that chunk is never requested at all: the site ships
 * as posters and CSS and pays nothing.
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import dynamic from "next/dynamic";
import {
  getTier,
  subscribeTier,
  watchReducedMotion,
  type Tier,
} from "./tier";
import {
  armLcpSignals,
  canvasWanted,
  onCanvasDemand,
  onEarlyCanvas,
  onLcpReady,
  whenIdle,
} from "./boot";

const ThreeRoot = dynamic(
  () => import("./ThreeRoot").then((mod) => mod.ThreeRoot),
  { ssr: false, loading: () => null }
);

interface ThreeContextValue {
  tier: Tier;
  /** True once the shared context exists and has drawn a frame. */
  canvasReady: boolean;
}

const ThreeContext = createContext<ThreeContextValue>({
  tier: "low",
  canvasReady: false,
});

export function useThreeTier(): Tier {
  return useContext(ThreeContext).tier;
}

export function useCanvasReady(): boolean {
  return useContext(ThreeContext).canvasReady;
}

export const CanvasProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tier, setTier] = useState<Tier>("low");
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);
  /**
   * The tier the renderer was built for. A mid-session demotion parks the
   * canvas rather than unmounting it — tearing <Canvas> down while R3F is
   * still configuring its root loses the context and leaves React removing
   * nodes that R3F has already removed. A parked context draws nothing.
   */
  const [renderTier, setRenderTier] = useState<Exclude<Tier, "low">>("mid");
  /** True once the LCP gate has opened. Mounting also needs a scene to want it. */
  const [gateOpen, setGateOpen] = useState(false);
  const [wanted, setWanted] = useState(false);

  // Tier is a client decision; the server always renders posters.
  useEffect(() => {
    const initial = getTier();
    setTier(initial);
    if (initial !== "low") setRenderTier(initial);

    const disarm = armLcpSignals();
    const unwatch = watchReducedMotion();
    const unsubscribe = subscribeTier((next) => {
      setTier(next);
      if (next === "low") setReady(false);
      else setRenderTier(next);
    });
    return () => {
      disarm();
      unwatch();
      unsubscribe();
    };
  }, []);

  // Mount gate: LCP first, then idle. The vel loader may jump the queue.
  useEffect(() => {
    if (tier === "low") return;
    let cancelled = false;
    let cancelIdle: (() => void) | undefined;

    const offLcp = onLcpReady(() => {
      cancelIdle = whenIdle(() => {
        if (!cancelled) setGateOpen(true);
      });
    });
    const offEarly = onEarlyCanvas(() => {
      if (!cancelled) setGateOpen(true);
    });

    setWanted(canvasWanted());
    const offDemand = onCanvasDemand((next) => {
      if (!cancelled) setWanted(next);
    });

    return () => {
      cancelled = true;
      offLcp();
      offEarly();
      offDemand();
      cancelIdle?.();
    };
  }, [tier]);

  // Once up, the context stays up — it is the whole point of one canvas for
  // the site. Demand only decides when it is first created.
  useEffect(() => {
    if (gateOpen && wanted) setMounted(true);
  }, [gateOpen, wanted]);

  const value = useMemo<ThreeContextValue>(
    () => ({ tier, canvasReady: ready && tier !== "low" }),
    [tier, ready]
  );

  return (
    <ThreeContext.Provider value={value}>
      {children}
      {mounted && (
        <ThreeRoot
          tier={renderTier}
          active={tier !== "low"}
          onReadyChange={setReady}
        />
      )}
    </ThreeContext.Provider>
  );
};
