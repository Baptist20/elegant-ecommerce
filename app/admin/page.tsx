import React from "react";

export default function AddProductBlogPage() {
  return (
    <div className="flex flex-col items-start w-full gap-10">
      <h2 className="text-2xl font-semibold text-black">
        Add New Product or Blog Post
      </h2>

      {/* Form for adding a product/blog */}
      <form className="flex flex-col items-start w-full max-w-[707px] p-0 gap-6">
        {/* Title/Name */}
        <div className="flex flex-col items-start w-full gap-3">
          <label className="text-xs font-bold uppercase text-[#6C7275]">
            Title/Name *
          </label>
          <div className="flex items-center w-full h-10 px-4 bg-white border border-[#CBCBCB] rounded-md focus-within:border-[#141718] transition-colors">
            <input
              type="text"
              placeholder="Product Name or Blog Title"
              className="w-full text-base font-normal text-black bg-transparent outline-none placeholder:text-[#6C7275]"
            />
          </div>
        </div>

        {/* Description/Content */}
        <div className="flex flex-col items-start w-full gap-3">
          <label className="text-xs font-bold uppercase text-[#6C7275]">
            Description/Content *
          </label>
          <div className="flex items-center w-full h-24 px-4 py-2 bg-white border border-[#CBCBCB] rounded-md focus-within:border-[#141718] transition-colors">
            <textarea
              placeholder="Product Description or Blog Content"
              className="w-full h-full text-base font-normal text-black bg-transparent outline-none placeholder:text-[#6C7275] resize-none"
            ></textarea>
          </div>
        </div>

        {/* Type (Product or Blog) */}
        <div className="flex flex-col items-start w-full gap-3">
          <label className="text-xs font-bold uppercase text-[#6C7275]">
            Type *
          </label>
          <select className="w-full h-10 px-4 bg-white border border-[#CBCBCB] rounded-md focus:border-[#141718] transition-colors text-base font-normal text-black outline-none">
            <option value="product">Product</option>
            <option value="blog">Blog Post</option>
          </select>
        </div>

        {/* Price (only for Product) */}
        <div className="flex flex-col items-start w-full gap-3">
          <label className="text-xs font-bold uppercase text-[#6C7275]">
            Price (for products) *
          </label>
          <div className="flex items-center w-full h-10 px-4 bg-white border border-[#CBCBCB] rounded-md focus-within:border-[#141718] transition-colors">
            <input
              type="number"
              placeholder="0.00"
              step="0.01"
              className="w-full text-base font-normal text-black bg-transparent outline-none placeholder:text-[#6C7275]"
            />
          </div>
        </div>

        {/* Image URL (for Product/Blog) */}
        <div className="flex flex-col items-start w-full gap-3">
          <label className="text-xs font-bold uppercase text-[#6C7275]">
            Image URL *
          </label>
          <div className="flex items-center w-full h-10 px-4 bg-white border border-[#CBCBCB] rounded-md focus-within:border-[#141718] transition-colors">
            <input
              type="text"
              placeholder="https://example.com/image.jpg"
              className="w-full text-base font-normal text-black bg-transparent outline-none placeholder:text-[#6C7275]"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="flex items-center justify-center px-10 py-3 gap-2 w-full md:w-[183px] h-12 bg-[#141718] text-white text-base font-medium rounded-lg hover:bg-black transition-all active:scale-[0.98]"
        >
          Add Item
        </button>
      </form>
    </div>
  );
}
