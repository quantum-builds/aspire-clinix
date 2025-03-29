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
      description: "Reassement from",
      price: "£200.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Root surface debribment from",
      price: "£750.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Periodontal surgery from",
      price: "£750.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Soft Tissue Grafting from",
      price: "£1300.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Gum recountring from",
      price: "£450.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Frenectomy from",
      price: "£600.00",
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
