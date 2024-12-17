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
      className={`flex justify-between w-full items-center py-1 border-t border-black font-gillSans
                ${lineTop ? "border-t" : ""}
                ${lineBottom ? "border-b" : ""}`}
    >
      <p className="text-left text-[16px] text-[#382F26] py-1 max-h-screen sm:text-[20px] lg:text-[30px] font-normal w-[60%] md:w-[65%]">
        {description}
      </p>
      <h1 className="text-right text-[16px] sm:text-[20px] font-normal w-[20%] md:w-[25%] lg:text-[30px]">
        {price}
      </h1>
    </div>
  );
}
