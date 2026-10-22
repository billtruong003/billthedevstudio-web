import { AboutPage } from "@/components/pages";
import { COPY } from "@/content/copy";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta("en", "/about/", COPY.en.pages.about.title, COPY.en.pages.about.meta);
export default function Page() {
  return <AboutPage locale="en" />;
}
