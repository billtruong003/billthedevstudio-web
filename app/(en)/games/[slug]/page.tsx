import { notFound } from "next/navigation";
import { GamePage } from "@/components/pages";
import { GAMES, gameBySlug } from "@/content/games";
import { pageMeta } from "@/lib/meta";

export const dynamicParams = false;
export const generateStaticParams = () => GAMES.map((g) => ({ slug: g.slug }));
export const generateMetadata = ({ params }: { params: { slug: string } }) => {
  const g = gameBySlug(params.slug);
  return g ? pageMeta("en", `/games/${g.slug}/`, g.name, `${g.tagline.en} ${g.short.en}`) : {};
};

export default function Page({ params }: { params: { slug: string } }) {
  const game = gameBySlug(params.slug);
  if (!game) notFound();
  return <GamePage game={game} locale="en" />;
}
