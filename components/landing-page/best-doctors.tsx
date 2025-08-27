"use client";
import { DoctorWithRelations } from "@/types";
import { motion, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import "swiper/css";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper/types";
import { User } from "../svg";
import { Button } from "../ui/button";

interface Doctor {
  id: number;
  image: StaticImageData;
  name: string;
  rating: number;
  qualification: string;
  location: string;
  consultations: number;
  yearsExperience: number;
  reviews: number;
  specialties?: string[];
}

const BestDoctors = () => {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [doctors, setDoctors] = useState<DoctorWithRelations[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  useEffect(() => {
    const handleResize = () => swiperInstance?.update();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [swiperInstance]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("/api/doctors?page=1&limit=15");
        const data = await response.json();
        if (response.ok) {
          // Update state with fetched doctors
          setDoctors(data?.data);
        } else {
          console.error("Error fetching doctors:", data);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, []);
  console.log(doctors[0]);
  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className=" bg-card/50 py-16 lg:py-20 "
      aria-labelledby="best-doctors-heading"
    >
      <div className="container space-y-6  ">
        {/* Header with proper heading hierarchy */}
        <header className="text-center  ">
          <motion.h2
            id="best-doctors-heading"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold text-default-800   mb-4"
          >
            Our Expert Doctors
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-default-600  max-w-2xl mx-auto"
          >
            Book appointments with our top-rated healthcare professionals
          </motion.p>
        </header>

        {/* Carousel Navigation */}
        <div className="flex justify-end gap-3  ">
          <button
            onClick={() => swiperInstance?.slidePrev()}
            className="w-10 h-10 rounded-full bg-white dark:bg-default-800 shadow-md flex items-center justify-center text-default-700 dark:text-default-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
            aria-label="Previous doctors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => swiperInstance?.slideNext()}
            className="w-10 h-10 rounded-full bg-white dark:bg-default-800 shadow-md flex items-center justify-center text-default-700 dark:text-default-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
            aria-label="Next doctors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Doctors Carousel */}
        <Swiper
          slidesPerView="auto"
          spaceBetween={24}
          speed={800}
          loop={true}
          modules={[Navigation]}
          grabCursor={true}
          breakpoints={{
            1536: { slidesPerView: 3 },
            1280: { slidesPerView: 3 },
            768: { slidesPerView: 2 },
            0: { slidesPerView: 1 },
          }}
          onSwiper={setSwiperInstance}
          className="!py-2"
        >
          {doctors.map((doctor, index) => (
            <SwiperSlide key={doctor.id} className="!h-auto">
              <motion.article
                transition={{ duration: 0.15, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group h-full bg-card  rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border p-4  space-y-4"
                itemScope
                itemType="https://schema.org/Physician"
              >
                {/* Doctor Image with proper alt text */}
                <figure className="relative lg:mx-auto h-full max-h-[250px] w-full max-w-[300px] aspect-square">
                  {doctor?.user?.image ? (
                    <Image
                      src={doctor.user?.image}
                      alt={`Portrait of ${doctor.user?.name}`}
                      fill
                      className="rounded-lg object-cover"
                      sizes="(max-width: 640px) 100vw, 250px"
                      itemProp="image"
                    />
                  ) : (
                    <div className="w-full h-full p-2 rounded-md border flex items-center justify-center bg-default-70 aspect-square">
                      <User className="w-1/2 h-1/2 text-default-700" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg" />
                  <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/90 dark:bg-default-900/90 px-2 py-1 rounded-full text-xs font-medium">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span
                      itemProp="aggregateRating"
                      itemScope
                      itemType="https://schema.org/AggregateRating"
                    >
                      <span itemProp="ratingValue">
                        {doctor?.averageRating}
                      </span>
                    </span>
                  </div>
                </figure>

                {/* Doctor Info with structured data */}

                <div className="mb-4">
                  <Link
                    href={`/doctors/${doctor?.id}`}
                    className="text-xl font-bold text-default-800 dark:text-white mb-1"
                    itemProp="url"
                  >
                    <h3 itemProp="name">{doctor?.user?.name}</h3>
                  </Link>

                  <p
                    className="text-base text-default-600 dark:text-default-300"
                    itemProp="hasCredential"
                  >
                    {doctor?.specialization}
                  </p>
                  <meta
                    itemProp="medicalSpecialty"
                    content={doctor.hospital || ""}
                  />
                </div>

                {/* Location and Experience with microdata */}

                <div className="flex flex-col gap-2 ">
                  <div>
                    <span className="text-primary">●</span>
                    <span
                      itemProp="location"
                      itemScope
                      itemType="https://schema.org/Place"
                    >
                      <span itemProp="address"> {doctor?.hospital}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex items-center bg-amber-100 text-amber-800 text-sm font-semibold px-2 py-1 rounded-full dark:bg-amber-900 dark:text-amber-300">
                      <Star className="w-4 h-4 fill-amber-500 text-amber-500 mr-1" />
                      {doctor?.averageRating || 0}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      ({doctor?.reviewsCount || 0} reviews)
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="mt-auto pt-4 border-t border-default-100 dark:border-default-700">
                  <div className="pt-2 flex gap-2 sm:gap-8 justify-between items-center">
                    <Button
                      variant="outline"
                      color="primary"
                      size="sm"
                      className="w-fit"
                      asChild
                    >
                      <Link
                        href={`/doctors/${doctor.id}#website`}
                        aria-label={`Visit ${doctor.user?.name}'s website`}
                      >
                        Website
                      </Link>
                    </Button>
                    <Button color="primary" size="sm" className="w-fit" asChild>
                      <Link
                        href={`/doctors/${doctor?.id}#chambers`}
                        aria-label={`View ${doctor.user?.name}'s chambers`}
                      >
                        Chambers
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.article>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* View All CTA with semantic link */}
        <div className="text-center   ">
          <Link
            href="/doctors"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
            aria-label="View all doctors"
          >
            View All Doctors
          </Link>
        </div>
      </div>
    </motion.section>
  );
};

export default BestDoctors;
