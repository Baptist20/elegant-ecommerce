import React from "react";
import BlogHeader from "../_components/BlogHeader";
import BlogsGroupSection from "../_components/BlogsGroupSection";

export default async function BlogPage(props: {
  searchParams?: Promise<{
    query?: string;
    sort?: string;
    category?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const sort = searchParams?.sort || "";
  const category = searchParams?.category || "";
  const page = searchParams?.page || "1";

  return (
    <div>
      <BlogHeader />
      <BlogsGroupSection
        query={query}
        sort={sort}
        category={category}
        page={page}
      />
    </div>
  );
}
