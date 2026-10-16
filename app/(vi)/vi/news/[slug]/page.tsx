import { notFound } from "next/navigation";
import { NewsArticlePage } from "@/components/news/NewsPages";
import { loadPosts, postBySlug } from "@/lib/news";
import { pageMeta } from "@/lib/meta";

export const dynamicParams = false;
export const generateStaticParams = () => loadPosts().map((p) => ({ slug: p.slug }));
export const generateMetadata = ({ params }: { params: { slug: string } }) => {
  const p = postBySlug(params.slug);
  if (!p) return {};
  const m = pageMeta("vi", `/news/${p.slug}/`, p.title, p.dek);
  return { ...m, openGraph: { ...m.openGraph, type: "article", images: [p.cover] }, robots: p.draft ? { index: false } : undefined };
};

export default function Page({ params }: { params: { slug: string } }) {
  const post = postBySlug(params.slug);
  if (!post) notFound();
  return <NewsArticlePage post={post} locale="vi" />;
}
