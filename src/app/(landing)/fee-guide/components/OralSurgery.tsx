import PriceList from "@/components/PriceList";

export default function OralSurgery() {
  const title = "Oral Surgery";
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
      description: "Reviews",
      price: "£160.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Tooth Extraction From",
      price: "£350.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Surgical Extractions From",
      price: "£450.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Wisdom Tooth Extraction From",
      price: "£750.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Surgery From",
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
