import { HomePage } from "@/components/pages";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta("en", "/");
export default function Page() {
  return <HomePage locale="en" />;
}
