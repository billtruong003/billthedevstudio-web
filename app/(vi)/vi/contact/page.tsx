import { ContactPage } from "@/components/pages";
import { COPY } from "@/content/copy";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta("vi", "/contact/", COPY.vi.pages.contact.title, COPY.vi.pages.contact.meta);
export default function Page() {
  return <ContactPage locale="vi" />;
}
