import React from "react";
import PriceItemList from "./PriceListItem";

interface RowData {
  description: string;
  price: string;
  lineTop: boolean;
  lineBottom: boolean;
}

interface TableProps {
  backgroundColor: string;
  title: string;
  rows: RowData[];
  prices?: string;
}

export default function PriceList({
  backgroundColor,
  title,
  rows,
  prices,
}: TableProps) {
  return (
    <div
      className={`w-full min-h-screen bg-${backgroundColor} flex justify-center items-center`}
      style={{ backgroundColor: `${backgroundColor}` }}
    >
      <div className="w-full p-2 md:w-[80%] py-10 overflow-auto">
        <div className="grid justify-between grid-cols-2 mb-4 flex-wrap w-full">
          <h1 className="text-[16px] sm:text-[18px] md:text-[30px] text-left font-normal font-opus w-full sm:w-auto">
            {title}
          </h1>
          <h5 className="text-[16px] sm:text-[18px] md:text-[30px] text-right font-normal font-opus w-full sm:w-auto">
            {prices}
          </h5>
        </div>

        <div>
          <ul>
            {rows.map((row, index) => {
              return (
                <PriceItemList
                  key={index}
                  description={row.description}
                  price={row.price}
                  lineBottom={row.lineBottom}
                  lineTop={row.lineTop}
                />
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
