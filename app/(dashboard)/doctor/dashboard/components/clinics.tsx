"use client";
import CustomImage from "@/components/ImageComponent";
import Link from "next/link";

const Clinics = ({ clinics }: { clinics: any }) => {
  return (
    <div className=" w-full">
      <div className="border   bg-card rounded-md space-y-2">
        <h1 className="text-lg md:text-xl font-medium  border-b   bg-card/50 text-default-700  p-4    ">
          Clinics Schedules
        </h1>

        <div className="md:max-h-[620px] space-y-4 p-4">
          {clinics?.map((item: any, index: number) => (
            <div
              key={`socials-${index}`}
              className="bg-background/50 rounded-md p-4 border"
            >
              {/* Clinic Header and Details */}
              <div className="w-full flex flex-col md:flex-row justify-between items-start gap-3   pb-2">
                {/* Clinic Image and Info */}
                <div className="flex flex-col sm:flex-row w-full items-start gap-3 flex-1">
                  <CustomImage
                    src={item.image}
                    alt={item.name}
                    aspectRatio="1/1"
                    containerClass="w-[109px]"
                    className="rounded-lg"
                  />

                  {/* Clinic Name and Details */}
                  <div className="flex-1">
                    <h1 className="font-medium">
                      {item.name.length > 35
                        ? `${item.name.slice(0, 35)}...`
                        : item.name}
                    </h1>
                    <span className="text-base text-muted-foreground">
                      $100 per consultation
                    </span>
                    <div className="w-full flex flex-col p-2 rounded-md text-xs gap-2">
                      <span>Tue : 07:00 AM - 09:00 PM</span>
                      <span>Wed : 07:00 AM - 09:00 PM</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <Link
            href="/doctor/patients"
            className=" text-default-700 text-base hover:text-blue-400  text-center pb-4  flex justify-center  "
          >
            View All
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Clinics;
