import React from "react";
import Head from "next/head";
import { AspireDarkLogo } from "@/assets";
import HeroNav from "@/components/HeroNav";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="bg-feeGuide min-h-screen">
      <HeroNav
        aspireLogo={AspireDarkLogo}
        textColor="trueBlack"
        backgroundColor="backgroundColor"
        buttonColor={"#D9D9D9"}
      />

      <Head>
        <title>Privacy Policy</title>
        <meta name="description" content="Privacy Policy" />
      </Head>

      <main className="w-11/12 md:w-4/5 mx-auto py-16 md:py-24 lg:py-36">
        <h1 className="text-5xl font-medium text-trueBlack mt-10 mb-5 font-opus">
          Privacy Policy
        </h1>

        <p className="text-trueBlack font-gillSans mb-6 text-2xl">
          Lorem ipsum dolor amet, consectetur adipiscing elit. Socioqua a nec
          magna habitant nec. Ullamcorper dui verius volutpat primis lacinia
          elit morbi velit. Ullamcorper dui verius volutpat primis lacinia elit
          morbi velit. Lorem ipsum dolor amet consectetur adipiscing elit. Lorem
          ipsum dolor amet, consectetur adipiscing elit.
        </p>

        <h2 className="text-4xl font-medium text-trueBlack font-gillSans mt-10 mb-5 ">
          Subheading
        </h2>

        <p className="text-trueBlack font-gillSans mb-6 text-2xl">
          Lorem ipsum dolor amet, consectetur adipiscing elit. Socioqua a nec
          magna habitant nec. Ullamcorper dui verius volutpat primis lacinia
          elit morbi velit. Ullamcorper dui verius volutpat primis lacinia elit
          morbi velit. Lorem ipsum dolor amet consectetur adipiscing elit. Lorem
          ipsum dolor amet, consectetur adipiscing elit.
        </p>

        <p className="text-trueBlack font-gillSans mb-6 text-2xl">
          Lorem ipsum dolor amet, consectetur adipiscing elit. Socioqua a nec
          magna habitant nec. Ullamcorper dui verius volutpat primis lacinia
          elit morbi velit. Ullamcorper dui verius volutpat primis lacinia elit
          morbi velit. Lorem ipsum dolor amet consectetur adipiscing elit. Lorem
          ipsum dolor amet, consectetur adipiscing elit.
        </p>

        <h2 className="text-4xl font-medium text-trueBlack font-opus mt-10 mb-5">
          Subheading
        </h2>

        <p className="text-trueBlack font-gillSans mb-6 text-2xl">
          Lorem ipsum dolor amet, consectetur adipiscing elit. Socioqua a nec
          magna habitant nec. Ullamcorper dui verius volutpat primis lacinia
          elit morbi velit. Ullamcorper dui verius volutpat primis lacinia elit
          morbi velit. Lorem ipsum dolor amet consectetur adipiscing elit. Lorem
          ipsum dolor amet, consectetur adipiscing elit.
        </p>

        <p className="text-trueBlack font-gillSans mb-6 text-2xl">
          Lorem ipsum dolor amet, consectetur adipiscing elit. Socioqua a nec
          magna habitant nec. Ullamcorper dui verius volutpat primis lacinia
          elit morbi velit. Ullamcorper dui verius volutpat primis lacinia elit
          morbi velit. Lorem ipsum dolor amet consectetur adipiscing elit. Lorem
          ipsum dolor amet, consectetur adipiscing elit.
        </p>

        <ul className="list-disc pl-6 mb-6 text-trueBlack font-gillSans text-2xl">
          <li className="mb-2">
            Lorem ipsum dolor amet, consectetur adipiscing elit.
          </li>
          <li className="mb-2">
            Lorem ipsum dolor amet, consectetur adipiscing elit.
          </li>
          <li className="mb-2">
            Lorem ipsum dolor amet, consectetur adipiscing elit.
          </li>
        </ul>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
