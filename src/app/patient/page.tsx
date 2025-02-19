import Footer from "@/components/Footer";
import SideBar from "./components/SideBar";
import ContentSection from "./components/ContenteSection";

const HERO_SECTION_DATA = {
  title: "STAY ON TOP OF YOUR WELLNESS",
  description: null,
  descTextSize: null,
  contentWidth: 100,
  backgroundColor: "#FFFFFF",
  buttonColor: "#ECE8E3",
  backgroundContent: "/videos/landing-page-video.mp4",
};

export default function Patient() {
  return (
    <div>
      <div className="h-[170vh] flex bg-feeguidedark">
        <SideBar />
        <ContentSection />
      </div>
      <Footer />

      {/* <Suspense>
        <SubscribeComponent
          priceId={"price_1QsMlWRsBYmDUkzANYBPoU0U"}
          price={"50.00"}
          description={"Yearly Payment"}
        />
      </Suspense> */}
    </div>
  );
}