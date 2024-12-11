interface PriceListItemProps {
  description: string;
  price: string;
  lineTop?: boolean;
  lineBottom?: boolean;
}

export default function PriceItemList({
  description,
  price,
  lineTop,
  lineBottom,
}: PriceListItemProps) {
  return (
    <div
      className={`flex justify-between items-center py-2 border-t border-black 
                ${lineTop ? "border-t" : ""}
                ${lineBottom ? "border-b" : ""}`}
    >
      <p className="text-left text-xl font-normal w-[65%]">{description}</p>
      <h1 className="text-right text-xl font-normal w-[25%]">{price}</h1>
    </div>
  );
}
