import { GamesPage } from "@/components/pages";
import { COPY } from "@/content/copy";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta("en", "/games/", COPY.en.pages.games.title, COPY.en.pages.games.meta);
export default function Page() {
  return <GamesPage locale="en" />;
}
