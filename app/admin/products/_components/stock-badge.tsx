import { Badge } from "@/components/ui/badge";

interface StockBadgeProps {
  stock: number;
}

export default function StockBadge({ stock }: StockBadgeProps) {
  const stockColorClass =
    stock < 10
      ? "bg-red-100 text-red-700"
      : stock < 15
        ? "bg-yellow-100 text-yellow-700"
        : "bg-emerald-100 text-emerald-700";

  return <Badge className={stockColorClass}>{stock}</Badge>;
}
