import Newsletter from "../_components/NewsLetter";
import ShopHeader from "../_components/ShopHeader";
import ShopProductSection from "../_components/ShopProductSection";

export default function ShopPage() {
  return (
    <div className="flex flex-col w-full bg-white">
      {/* 1. The Header component we built */}
      <ShopHeader />

      {/* 2. The "Products" Parent Container Section */}

      <ShopProductSection />
    </div>
  );
}
