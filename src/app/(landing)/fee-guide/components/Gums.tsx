import PriceList from "@/components/PriceList";

export default function Gums() {
  const title = "Gums";
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
      description: "Hygiene (60 mins)",
      price: "£185.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Hygiene (45 mins)",
      price: "£145.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Reassessment",
      price: "from £200.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Root Surface Debribment",
      price: "from £750.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Periodontal Surgery",
      price: "from £750.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Soft Tissue Grafting",
      price: "from £1300.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Gum Recontouring",
      price: "from £450.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Frenectomy",
      price: "from £600.00",
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
