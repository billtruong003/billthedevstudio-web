import { ContactPage } from "@/components/pages";
import { COPY } from "@/content/copy";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta("en", "/contact/", COPY.en.pages.contact.title, COPY.en.pages.contact.meta);
export default function Page() {
  return <ContactPage locale="en" />;
}
