import React from "react";
import ShopToolbar from "./ShopToolbar";
import ProductCard from "./ProductCard";

export default function ShopProductSection() {
  return (
    <section className="flex flex-row items-start px-10 lg:px-[160px] pt-[60px] gap-6 w-full max-w-[1440px] h-auto flex-none pb-30">
      <div className="flex flex-col items-start p-0 gap-10 w-full max-w-[1120px] h-auto flex-none">
        <ShopToolbar />
        <div className="flex flex-col justify-center flex-wrap items-center md:items-start gap-20 w-full max-w-[1120px] h-auto flex-none ">
          <ProductCard
            name="hello"
            image="/"
            price={100}
            rating={3}
            key={"hello"}
          />
        </div>
      </div>
    </section>
  );
}
