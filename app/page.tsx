import HomeClient from "@/components/HomeClient";
import { fetchNodesServer } from "@/lib/api";

// Fetched server-side so the first HTML response already contains real node
// prices (not an empty map shell) — matters for bots/crawlers/AI agents that
// fetch this page without executing client JS.
export default async function Home() {
  let initialNodes;
  try {
    initialNodes = await fetchNodesServer("NYISO", "RT");
  } catch {
    initialNodes = undefined;
  }

  return <HomeClient initialNodes={initialNodes} />;
}
