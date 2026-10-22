import { NewsIndexPage } from "@/components/news/NewsPages";
import { COPY } from "@/content/copy";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta("en", "/news/", COPY.en.news.title, COPY.en.news.meta);
export default function Page() {
  return <NewsIndexPage locale="en" />;
}
