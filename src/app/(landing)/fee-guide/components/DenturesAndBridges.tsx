import PriceList from "@/components/PriceList";

export default function DentureAndBridges() {
  const title = "Dentures, Crowns & Bridges";
  const prices = "Price starting from";
  const backgroundColor = "#ECE8E3";
  const rows = [
    {
      description: "New Patient Exam Child / Adult",
      price: "£ XX / £ XX",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Routine Exam Child / Adult",
      price: "£ XX / £ XX",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Hygiene Session Child 20mins / Adult 30/45mins",
      price: "£ XX / £ XX",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Root Scale Debridement 30mins per quadrant",
      price: "£ XX / £ XX",
      lineTop: true,
      lineBottom: false,
    },
    {
      description:
        "New Patient Emergency (Excluding Treatment costs, Including 1 x X-ray)",
      price: "£ XX / £ XX",
      lineTop: true,
      lineBottom: false,
    },
    {
      description:
        "Existing Patient Emergency (Excluding Treatment costs, Including 1 x X-ray)",
      price: "£ XX / £ XX",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Panoral (OPG X-Ray)",
      price: "£ XX / £ XX",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "CBCT Scan",
      price: "£ XX / £ XX",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Sedation",
      price: "£ XX / £ XX",
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
