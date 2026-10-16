import { PressPage } from "@/components/pages";
import { COPY } from "@/content/copy";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta("vi", "/press/", COPY.vi.press.kicker, COPY.vi.press.sub);
export default function Page() {
  return <PressPage locale="vi" />;
}
