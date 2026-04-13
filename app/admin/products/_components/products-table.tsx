import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StockBadge from "./stock-badge";
import type { AdminProduct } from "./types";

interface ProductsTableProps {
  products: AdminProduct[];
  onEdit: (product: AdminProduct) => void;
  onDelete: (productId: string) => void;
}

export default function ProductsTable({
  products,
  onEdit,
  onDelete,
}: ProductsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg tracking-tight text-[#141718]">
          Product Inventory
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="space-y-1">
                    <p className="font-medium text-[#141718]">{product.name}</p>
                    <p className="text-xs text-[#6C7275]">{product.slug}</p>
                  </div>
                </TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>
                  <StockBadge stock={product.stock} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={() => onEdit(product)}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon-sm"
                      onClick={() => onDelete(product.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
