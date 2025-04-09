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
      description: "Tongue Tie",
      price: "£450.00",
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
      description: "Tooth Extraction",
      price: "from £350.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Surgical Extractions",
      price: "from £450.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Wisdom Tooth Extraction",
      price: "from £750.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Surgery",
      price: "from £995.00",
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
