import PriceList from "@/components/PriceList";

export default function CheckupAndRoutine() {
  const title = "Checkup & Routine Treatment";
  const prices = "Prices";
  const backgroundColor = "#ECE8E3";
  const rows = [
    {
      description: "New Patient Consult (inc xrays)",
      price: "£245.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Maintenance consult  (inc xrays)",
      price: "£170.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "New patient emergency (exc treatment)",
      price: "£240.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Existing patient emergency (exc treatment)",
      price: "£160.00",
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
      description: "Fillings from",
      price: "£375.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Onlays from",
      price: "£1500.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Crowns from",
      price: "£1200.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Onlays from",
      price: "£1500.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Crowns from",
      price: "£1200.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Night Gaurds",
      price: "£760.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Sports Gaurds",
      price: "£750.00",
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
