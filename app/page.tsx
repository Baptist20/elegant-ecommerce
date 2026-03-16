import Hero from "./_components/Hero";
import CategoryBanner from "./_components/CategoryBanner";
import NewArrivals from "./_components/NewArrivals";
import Values from "./_components/Values";
import PromoBanner from "./_components/PromoBanner";
import Articles from "./_components/Articles";
import Newsletter from "./_components/NewsLetter";

export default function Home() {
  return (
    <div>
      <Hero />
      <CategoryBanner />
      <NewArrivals />
      <Values />
      <PromoBanner />
      <Articles />
      <Newsletter />
    </div>
  );
}
