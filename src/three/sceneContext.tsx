"use client";

/**
 * Gives a scene the DOM box it is drawn into.
 *
 * The canvas is `pointer-events: none`, so interaction is read from the
 * tracking element rather than from the renderer. That is deliberate: it keeps
 * hit-testing in the layer the user is actually touching, and it means two
 * scenes on one page can never fight over the event target.
 */

import React, { createContext, useContext } from "react";

export type SceneTrack = React.RefObject<HTMLDivElement | null>;

const SceneTrackContext = createContext<SceneTrack | null>(null);

export const SceneTrackProvider: React.FC<{
  track: SceneTrack;
  children: React.ReactNode;
}> = ({ track, children }) => (
  <SceneTrackContext.Provider value={track}>
    {children}
  </SceneTrackContext.Provider>
);

export function useSceneTrack(): SceneTrack | null {
  return useContext(SceneTrackContext);
}
