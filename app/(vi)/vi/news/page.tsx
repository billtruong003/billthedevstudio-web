import { NewsIndexPage } from "@/components/news/NewsPages";
import { COPY } from "@/content/copy";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta("vi", "/news/", COPY.vi.news.title, COPY.vi.news.meta);
export default function Page() {
  return <NewsIndexPage locale="vi" />;
}
