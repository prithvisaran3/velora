/**
 * The only loader on the site.
 *
 * Every route segment without its own `loading.tsx` falls through to this one,
 * so a slow page shows a running stitch rather than a blank main or a spinner
 * borrowed from somewhere else. It is SVG and CSS, so it paints at t0.
 */

import { ThreadLoaderPage } from "@/view/thread/ThreadLoader";

export default function Loading() {
  return <ThreadLoaderPage />;
}
