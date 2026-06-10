import { Badge } from "@/components/ui/badge";
import { getCategoryColorHex } from "@/lib/category-options";

interface CategoryColorProps {
  color: string;
  label: string;
}

export function CategoryColor({ color, label }: CategoryColorProps) {
  const hex = getCategoryColorHex(color);

  return (
    <Badge
      variant="outline"
      className="text-sm"
      style={{
        backgroundColor: `${hex}1a`,
        borderColor: `${hex}33`,
        color: hex,
      }}
    >
      {label}
    </Badge>
  );
}

