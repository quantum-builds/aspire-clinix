import PriceList from "@/components/PriceList";

export default function RootCanal() {
  const title = "Root Canal";
  const prices = "Prices";
  const backgroundColor = "#DCD4C9";
  const rows = [
    {
      description: "New Patient Consult ",
      price: "£245.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Root Canal from",
      price: "£1300.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Re-Root Canal from",
      price: "£1600.00",
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
