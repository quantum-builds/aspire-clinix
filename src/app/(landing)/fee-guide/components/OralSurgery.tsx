import PriceList from "@/components/PriceList";

export default function OralSurgery() {
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
      description: "Reviews",
      price: "£160.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Tooth Extraction from",
      price: "£350.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Surgical Extractions from",
      price: "£450.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Wisdom tooth extraction from",
      price: "£750.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Surgery from",
      price: "£995.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Tongue Tie",
      price: "£450.00",
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
