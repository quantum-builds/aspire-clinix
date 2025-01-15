// pages/consultation-costs.tsx
import PriceList from "@/components/PriceList";

export default function ConsultationCosts() {
  const title = "Consultation Costs";
  const prices = "Prices starting from";
  const backgroundColor = "#DCD4C9";
  const rows = [
    {
      description: "New Patient Exam Child / Adult",
      price: "£XX / £XX",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Routine Exam Child / Adult",
      price: "£XX / £XX",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Hygiene Session Child 20mins / Adult 30/45mins",
      price: "£XX / £XX",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Root Scale Debridement 30mins per quadrant",
      price: "£XXX",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "New Patient Emergency (Including 1 X-ray)",
      price: "£XXX",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Existing Patient Emergency (Including 1 X-ray)",
      price: "£XX",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Panoral (OPG X-Ray)",
      price: "£XX",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "CBCT Scan",
      price: "£XXX",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Sedation",
      price: "£XXX",
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
