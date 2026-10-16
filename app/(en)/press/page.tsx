import { PressPage } from "@/components/pages";
import { COPY } from "@/content/copy";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta("en", "/press/", COPY.en.press.kicker, COPY.en.press.sub);
export default function Page() {
  return <PressPage locale="en" />;
}
