import { AboutPage } from "@/components/pages";
import { COPY } from "@/content/copy";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta("vi", "/about/", COPY.vi.pages.about.title, COPY.vi.pages.about.meta);
export default function Page() {
  return <AboutPage locale="vi" />;
}
