// import { getAllItems } from "@/services/items/itemsQuery";
// import { ItemType } from "@/types/item";
import ItemLayout from "./components/ItemsLayout";
// import { AspireAcademyDarkLogo2 } from "@/assets";
import HeroNav from "@/components/HeroNav";

enum ItemType {
  ALL = "ALL",
  TOOTH_CARE = "TOOTH_CARE",
  GUM_CARE = "GUM_CARE",
}

export default async function StorePage() {
  // const response = await getAllItems();
  // console.log(response);
  // const items = response.data ? response.data : [];

  const items = [
    {
      id: 1,
      title: "ORGANIC TOOTHBRUSH",
      price: 45,
      type: ItemType.TOOTH_CARE,
    },
    { id: 2, title: "ORGANIC TOOTHBRUSH", price: 45, type: ItemType.GUM_CARE },
    {
      id: 3,
      title: "ORGANIC TOOTHBRUSH",
      price: 45,
      type: ItemType.TOOTH_CARE,
    },
    {
      id: 4,
      title: "ORGANIC TOOTHBRUSH",
      price: 45,
      type: ItemType.TOOTH_CARE,
    },
    {
      id: 5,
      title: "ORGANIC TOOTHBRUSH",
      price: 45,
      type: ItemType.TOOTH_CARE,
    },
    { id: 6, title: "ORGANIC TOOTHBRUSH", price: 45, type: ItemType.GUM_CARE },
    {
      id: 7,
      title: "ORGANIC TOOTHBRUSH",
      price: 45,
      type: ItemType.TOOTH_CARE,
    },
    { id: 8, title: "ORGANIC TOOTHBRUSH", price: 45, type: ItemType.GUM_CARE },
    {
      id: 9,
      title: "ORGANIC TOOTHBRUSH",
      price: 45,
      type: ItemType.TOOTH_CARE,
    },
    { id: 10, title: "ORGANIC TOOTHBRUSH", price: 45, type: ItemType.GUM_CARE },
    {
      id: 11,
      title: "ORGANIC TOOTHBRUSH",
      price: 45,
      type: ItemType.TOOTH_CARE,
    },
    { id: 12, title: "ORGANIC TOOTHBRUSH", price: 45, type: ItemType.GUM_CARE },
    {
      id: 13,
      title: "ORGANIC TOOTHBRUSH",
      price: 45,
      type: ItemType.TOOTH_CARE,
    },
    { id: 14, title: "ORGANIC TOOTHBRUSH", price: 45, type: ItemType.GUM_CARE },
    {
      id: 15,
      title: "ORGANIC TOOTHBRUSH",
      price: 45,
      type: ItemType.TOOTH_CARE,
    },
  ];
  return (
    <div className="zoom-out min-h-screen w-full">
      {/* <HeroNav
        aspireLogo={AspireAcademyDarkLogo2}
        textColor="trueBlack"
        backgroundColor="backgroundColor"
      /> */}
      <ItemLayout items={items} />
    </div>
  );
}
