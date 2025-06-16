import PriceList from "@/components/PriceList";

export default function Orthodontics() {
  const title = "Orthodontics";
  const prices = "Prices";
  const backgroundColor = "#ECE8E3";
  const rows = [
    {
      description: "New Patient Consult ",
      price: "£245.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Clear aligners (Invisalign or Spark) from",
      price: "£4,000.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Fixed Braces from",
      price: "£5,000.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Bonded fixed retainer per arch",
      price: "£265.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Removable retainers",
      price: "£175.00",
      lineTop: true,
      lineBottom: true,
    },
  ];

  return (
    <PriceList
      title={title}
      rows={rows}
      prices={prices}
      backgroundColor={backgroundColor}
    />
  );
}
