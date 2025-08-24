"use client";

import { motion } from "framer-motion";
import "swiper/css";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Partners1,
  Partners2,
  Partners3,
  Partners4,
  Partners5,
  Partners6,
  Urology,
} from "../svg";

const items = [
  { src: <Partners1 />, alt: "Slide 1", inner: <Urology />, label: "Urology" },
  { src: <Partners2 />, alt: "Slide 2", inner: <Urology />, label: "Urology" },
  { src: <Partners3 />, alt: "Slide 3", inner: <Urology />, label: "Urology" },
  { src: <Partners4 />, alt: "Slide 4", inner: <Urology />, label: "Urology" },
  { src: <Partners5 />, alt: "Slide 5", inner: <Urology />, label: "Urology" },
  { src: <Partners6 />, alt: "Slide 6", inner: <Urology />, label: "Urology" },
  { src: <Partners6 />, alt: "Slide 6", inner: <Urology />, label: "Urology" },
  { src: <Partners6 />, alt: "Slide 6", inner: <Urology />, label: "Urology" },
];

const PartnersPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }} // Ensures animation only happens once
      className="container py-16"
    >
      <div className=" bg-primary-900 dark:bg-primary/10 p-6 rounded-md shadow-lg">
        <div className="space-y-1 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg font-medium text-white mt-4"
          >
            Trusted by 5+ million people at companies like
          </motion.h1>
        </div>

        <div className="py-4">
          <Swiper
            slidesPerView={1}
            spaceBetween={15}
            speed={1500}
            loop={true}
            grabCursor={true}
            modules={[Navigation, Autoplay]}
            autoplay={{
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
              delay: 3000,
            }}
            breakpoints={{
              1024: { slidesPerView: 6, spaceBetween: 15 },
              768: { slidesPerView: 4, spaceBetween: 15 },
              480: { slidesPerView: 2, spaceBetween: 15 },
              0: { slidesPerView: 1, spaceBetween: 15 },
            }}
            navigation={{
              prevEl: ".swiper-button-prev",
              nextEl: ".swiper-button-next",
            }}
            className="my-16"
          >
            {items.map((item, index) => (
              <SwiperSlide key={index}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.5,
                    ease: "easeOut",
                    delay: index * 0.1,
                  }}
                  viewport={{ once: true }}
                  className="relative w-full h-full flex justify-center items-center"
                >
                  {item.src}
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </motion.div>
  );
};

export default PartnersPage;
