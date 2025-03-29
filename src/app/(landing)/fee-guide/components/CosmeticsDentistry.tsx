import PriceList from "@/components/PriceList";

export default function CosmeticsDentistry() {
  const title = "Cosmetics Dentistry";
  const prices = "Prices";
  const backgroundColor = "#DCD4C9";
  const rows = [
    {
      description: "Whitening",
      price: "£495.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Composite bonding per tooth",
      price: "£360.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Porcelain Veneers per tooth from",
      price: "£1500.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "ICON Per tooth",
      price: "£350.00",
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
