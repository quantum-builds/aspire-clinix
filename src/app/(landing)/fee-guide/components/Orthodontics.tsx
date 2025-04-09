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
      description: "Bonded Fixed Retainer Per Arch",
      price: "£265.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Removable Retainers",
      price: "£175.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Clear Aligners (Invisalign or Spark)",
      price: "from £4,000.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Fixed Braces",
      price: "from £5,000.00",
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
