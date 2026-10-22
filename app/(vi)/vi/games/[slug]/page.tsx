import { notFound } from "next/navigation";
import { GamePage } from "@/components/pages";
import { GAMES, gameBySlug } from "@/content/games";
import { pageMeta } from "@/lib/meta";

export const dynamicParams = false;
export const generateStaticParams = () => GAMES.map((g) => ({ slug: g.slug }));
export const generateMetadata = ({ params }: { params: { slug: string } }) => {
  const g = gameBySlug(params.slug);
  return g ? pageMeta("vi", `/games/${g.slug}/`, g.name, `${g.tagline.vi} ${g.short.vi}`, g.keyArt) : {};
};

export default function Page({ params }: { params: { slug: string } }) {
  const game = gameBySlug(params.slug);
  if (!game) notFound();
  return <GamePage game={game} locale="vi" />;
}
