import React from "react";
import ShopToolbar from "./ShopToolbar";
import ProductCard from "./ProductCard";

export default function ShopProductSection() {
  return (
    <section className="flex flex-row items-start px-10 lg:px-[160px] pt-[60px] pb-[100px] gap-6 w-full max-w-[1440px] h-auto lg:h-[1749px] flex-none order-3 grow-0">
      <div className="flex flex-col items-start p-0 gap-10 w-full max-w-[1120px] h-auto lg:h-[1589px] flex-none order-0 grow-0">
        <ShopToolbar />
        <div className="flex flex-col items-center p-0 gap-20 w-full max-w-[1120px] h-auto lg:h-[1467px] flex-none order-1 grow-0">
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
