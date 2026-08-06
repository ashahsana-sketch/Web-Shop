import { Package, CircleCheck, TriangleAlert, CircleX } from "lucide-react";
type SummaryCardsProps = {
  total: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
};

export default function SummaryCards({
  total,
  inStock,
  lowStock,
  outOfStock,
}: SummaryCardsProps) {

const cards = [
  {
    title: "Total Products",
    value: total,
    color: "text-violet-700",
    icon: <Package className="w-6 h-6 text-violet-700" />,
  },
  {
    title: "In Stock",
    value: inStock,
    color: "text-green-700",
    icon: <CircleCheck className="w-6 h-6 text-green-700" />,
  },
  {
    title: "Low Stock",
    value: lowStock,
    color: "text-orange-500",
    icon: <TriangleAlert className="w-6 h-6 text-orange-500" />,
  },
  {
    title: "Out of Stock",
    value: outOfStock,
    color: "text-red-700",
    icon: <CircleX className="w-6 h-6 text-red-700" />,
  },
];

return (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6">
    {cards.map((card) => (
      <div
        key={card.title}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-gray-600 text-sm">
              {card.title}
            </h3>

            <p className={`text-3xl font-bold mt-2 ${card.color}`}>
              {card.value}
            </p>
          </div>

          <div className="flex items-center">
            {card.icon}
          </div>
        </div>
      </div>
    ))}
  </div>
);
}