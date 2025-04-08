import PriceList from "@/components/PriceList";

export default function Dentures() {
  const title = "Dentures";
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
      description: "Acrylic Denture From",
      price: "£XX",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Chrome Denture Per Arch From",
      price: "£XX",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Full Upper Denture (Per Jaw)",
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
