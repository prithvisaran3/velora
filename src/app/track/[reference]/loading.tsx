import { ThreadLoaderPage } from "@/view/thread/ThreadLoader";
import { UI } from "@/content/ui";

export default function Loading() {
  return <ThreadLoaderPage label={UI.loading.order} />;
}
