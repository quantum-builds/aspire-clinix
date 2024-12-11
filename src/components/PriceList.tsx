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
      className={`w-full h-screen bg-${backgroundColor} flex justify-center items-center`}
      style={{ backgroundColor: `${backgroundColor}` }}
    >
      <div className="w-[80%] py-10">
        <div className="flex justify-between mb-4">
          <h1 className="text-3xl text-left font-normal">{title}</h1>
          <h5 className="text-right text-xl font-normal">{prices}</h5>
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
