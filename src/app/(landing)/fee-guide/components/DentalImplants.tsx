import PriceList from "@/components/PriceList";

export default function DentalImplants() {
  const title = "Dental Implants";
  const prices = "Prices starting from";
  const backgroundColor = "#ECE8E3";
  const rows = [
    {
      description: "New Patient Consult",
      price: "£245.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Reviews",
      price: "£180.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Implants from",
      price: "£3700.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "CT Scan per jaw ",
      price: "£180.00",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Bone Augmentation ",
      price: "POA",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Implant removal",
      price: "POA",
      lineTop: true,
      lineBottom: false,
    },
    {
      description: "Implant supported denture from",
      price: "£5800.00",
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
