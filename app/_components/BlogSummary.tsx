import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function BlogSummary({
  latestBlog,
  totalCount,
}: {
  latestBlog: any;
  totalCount: number;
}) {
  return (
    <Card className="border-none shadow-sm rounded-2xl bg-black text-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold font-poppins flex items-center gap-2">
          <FileText className="w-5 h-5 text-gray-400" />
          Content Hub
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-widest">
            Latest Post
          </p>
          <h4 className="text-md font-medium mt-1 truncate">
            {latestBlog?.title || "No posts yet"}
          </h4>
          <p className="text-xs text-gray-500 mt-1">
            {latestBlog ? new Date(latestBlog.createdAt).toDateString() : "-"}
          </p>
        </div>
        <div className="pt-4 border-t border-gray-800">
          <p className="text-3xl font-bold">{totalCount}</p>
          <p className="text-xs text-gray-400">Total Blog Articles</p>
        </div>
      </CardContent>
    </Card>
  );
}
