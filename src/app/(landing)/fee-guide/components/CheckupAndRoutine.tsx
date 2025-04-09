import PriceList from "@/components/PriceList";

export default function CheckupAndRoutine() {
  const title = "Checkup & Routine Treatment";
  const prices = "Prices";
  const backgroundColor = "#ECE8E3";
  const rows = [
    {
      description: "New Patient Consult (INC Xrays)",
      price: "£245.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Maintenance Consult  (INC Xrays)",
      price: "£170.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "New Patient Emergency (EXC Treatment)",
      price: "£240.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Existing Patient Emergency (EXC Treatment)",
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
      description: "Night Guards",
      price: "£760.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Sports Guards",
      price: "£750.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Fillings ",
      price: "from £375.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Onlays",
      price: "from £1500.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Crowns",
      price: "from £1200.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Onlays",
      price: "from £1500.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Crowns",
      price: "from £1200.00",
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
