import PriceList from "@/components/PriceList";

export default function Dentures() {
  const title = "Root Canal";
  const prices = "Prices starting from";
  const backgroundColor = "#DCD4C9";
  const rows = [
    {
      description: "New Patient Consult ",
      price: "£245.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Acrylic denture from",
      price: "£XX",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Chrome denture per arch from",
      price: "£XX",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Full Upper denture (per jaw)",
      price: "£2400.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Denutre Repair",
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
