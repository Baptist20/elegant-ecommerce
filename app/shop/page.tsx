import Newsletter from "../_components/NewsLetter";
import ShopHeader from "../_components/ShopHeader";
import ShopProductSection from "../_components/ShopProductSection";

export default async function ShopPage(props: {
  searchParams?: Promise<{
    query?: string;
    sort?: string;
    category?: string;
    price?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const sort = searchParams?.sort || "";
  const category = searchParams?.category || "";
  const price = searchParams?.price || "";
  const page = searchParams?.page || "1";

  return (
    <div className="flex flex-col w-full bg-white">
      {/* 1. The Header component we built */}
      <ShopHeader />

      {/* 2. The "Products" Parent Container Section */}
      <ShopProductSection
        query={query}
        sort={sort}
        category={category}
        price={price}
        page={page}
      />
    </div>
  );
}
