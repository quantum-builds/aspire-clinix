import PriceList from "@/components/PriceList";

export default function CosmeticsDentistry() {
  const title = "Cosmetic Dentistry";
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
      description: "Composite Bonding Per Tooth",
      price: "£360.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Porcelain Veneers Per Tooth From",
      price: "£1500.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "ICON Per Tooth",
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
