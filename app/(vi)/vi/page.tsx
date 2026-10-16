import { HomePage } from "@/components/pages";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta("vi", "/");
export default function Page() {
  return <HomePage locale="vi" />;
}
