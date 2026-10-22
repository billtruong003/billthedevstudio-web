import { GamesPage } from "@/components/pages";
import { COPY } from "@/content/copy";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta("vi", "/games/", COPY.vi.pages.games.title, COPY.vi.pages.games.meta);
export default function Page() {
  return <GamesPage locale="vi" />;
}
