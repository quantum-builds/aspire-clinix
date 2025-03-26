import PriceList from "@/components/PriceList";

export default function ChildrenDentistry() {
  const title = "Cosmetics Dentistry";
  const prices = "Prices starting from";
  const backgroundColor = "#ECE8E3";
  const rows = [
    {
      description: "New Patient Consult 0-3",
      price: "£125.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "New Patient Consult 3-16",
      price: "£200.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Maintenance consult 0-3",
      price: "£100.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Maintenance consult 3-16",
      price: "£175.00",
      lineTop: true,
      lineBottom: true,
    },
    {
      description: "New patient emergency (exc treatment)",
      price: "£220.00",
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
      description: "Fissue Sealents from",
      price: "£120.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Fillings from",
      price: "£200.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Root treatment on baby teeth from",
      price: "£200.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Stainless Steel Crown from",
      price: "£290.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Extractions from",
      price: "£190.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Mangment of traumatised teeth",
      price: "£300.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Inhlation Sedation from",
      price: "£300.00",
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
