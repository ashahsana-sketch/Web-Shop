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
    },
    {
      title: "In Stock",
      value: inStock,
      color: "text-green-700",
    },
    {
      title: "Low Stock",
      value: lowStock,
      color: "text-orange-500",
    },
    {
      title: "Out of Stock",
      value: outOfStock,
      color: "text-red-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6"> {cards.map((card) => (
        <div key={card.title}className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 text-sm">{card.title} </h3>
          <p className={`text-3xl font-bold mt-2 ${card.color}`}> {card.value} </p>
        </div>
      ))}
    </div>
  );
}