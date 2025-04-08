import PriceList from "@/components/PriceList";

export default function ChildrenDentistry() {
  const title = "Children Dentistry";
  const prices = "Prices";
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
      description: "Maintenance Consult 0-3",
      price: "£100.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Maintenance Consult 3-16",
      price: "£175.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "New Patient Emergency (EXC Treatment)",
      price: "£220.00",
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
      description: "Fissue Sealents From",
      price: "£120.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Fillings From",
      price: "£200.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Root Treatment On Baby Teeth From",
      price: "£200.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Stainless Steel Crown From",
      price: "£290.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Extractions From",
      price: "£190.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Management Of Traumatised Teeth",
      price: "£300.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Inhalation Sedation From",
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
