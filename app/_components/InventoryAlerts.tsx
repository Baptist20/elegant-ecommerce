import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InventoryAlerts({ products }: { products: any[] }) {
  return (
    <Card className="border-none shadow-sm rounded-2xl">
      <CardHeader>
        <CardTitle className="text-lg font-semibold font-poppins flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          Low Stock Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {products.length === 0 ? (
          <p className="text-sm text-gray-500 italic">
            All stock levels are healthy.
          </p>
        ) : (
          products.map((product) => (
            <div
              key={product._id}
              className="flex items-center justify-between p-3 rounded-lg bg-red-50/50 border border-red-100"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {product.name}
                </p>
                <p className="text-xs text-red-600 font-semibold">
                  {product.stock} units left
                </p>
              </div>
              <Button size="sm" variant="ghost" asChild>
                <Link href={`/admin/add-product?id=${product._id}`}>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
