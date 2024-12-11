import PriceList from "@/components/PriceList";

export default function InvisalignAndRetainer() {
  const title = "Fillings, Root Canal Treatment & Extractions";
  const prices = "Prices Starting from";
  const backgroundColor = "#DCD4C9";
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
      description: "sedation",
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
