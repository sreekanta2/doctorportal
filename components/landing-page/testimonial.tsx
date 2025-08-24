"use client";

import { avatar } from "@/config/site";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import Image from "next/image";
import "swiper/css";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Rating } from "../ui/rating";

// Demo testimonial data
const testimonials = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    role: "Cardiologist",
    rating: 5,
    content:
      "The care I received was exceptional. The doctors were knowledgeable and took time to explain everything clearly.",
    location: "New York, USA",
    avatar: "/doctors/doctor1.jpg", // Replace with actual image path
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Patient",
    rating: 4,
    content:
      "The hospital facilities are top-notch and the staff is very professional. My recovery was faster than expected.",
    location: "Toronto, Canada",
    avatar: "/patients/patient1.jpg", // Replace with actual image path
  },
  {
    id: 3,
    name: "Dr. David Wilson",
    role: "Neurologist",
    rating: 5,
    content:
      "Working here has been a great experience. The team collaboration makes patient care seamless and effective.",
    location: "London, UK",
    avatar: "/doctors/doctor2.jpg", // Replace with actual image path
  },
  {
    id: 4,
    name: "Emily Rodriguez",
    role: "Patient",
    rating: 5,
    content:
      "From admission to discharge, every step was handled with care and professionalism. Highly recommended!",
    location: "Sydney, Australia",
    avatar: "/patients/patient2.jpg", // Replace with actual image path
  },
  {
    id: 5,
    name: "Dr. James Lee",
    role: "Orthopedic Surgeon",
    rating: 4,
    content:
      "The support staff makes my job easier, allowing me to focus on providing the best care to my patients.",
    location: "Singapore",
    avatar: "/doctors/doctor3.jpg", // Replace with actual image path
  },
  {
    id: 6,
    name: "Olivia Smith",
    role: "Patient",
    rating: 5,
    content:
      "The doctors listened to my concerns and provided personalized treatment that actually worked for me.",
    location: "Berlin, Germany",
    avatar: "/patients/patient3.jpg", // Replace with actual image path
  },
];

const Testimonial = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, margin: "0px 0px -100px 0px" }}
      className="bg-card/30  dark:bg-[#0e1527] pt-16 lg:py-20"
    >
      <div className="container  ">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4"
          >
            What People Say About Us
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            Hear from our patients and medical professionals about their
            experiences
          </motion.p>
        </div>

        {/* Carousel */}
        <div className="relative  ">
          <Swiper
            slidesPerView={1}
            spaceBetween={20}
            speed={1000}
            loop={true}
            grabCursor={true}
            modules={[Navigation, Autoplay]}
            autoplay={{
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
              delay: 4000,
            }}
            breakpoints={{
              1024: { slidesPerView: 2 },
              800: { slidesPerView: 2 },
              640: { slidesPerView: 1 },
              0: { slidesPerView: 1 },
            }}
            navigation={{
              prevEl: ".testimonial-prev",
              nextEl: ".testimonial-next",
            }}
            className="!py-4"
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={testimonial.id}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card shadow-lg rounded-lg p-6 text-left border dark:border-0 h-full"
                >
                  <div className="flex gap-1 mb-2">
                    <Rating
                      value={testimonial.rating}
                      readOnly
                      className="gap-x-0.5 max-w-[100px]"
                    />
                  </div>
                  <h4 className="font-semibold text-lg mb-2">
                    {testimonial.content.split(" ").slice(0, 8).join(" ")}...
                  </h4>
                  <p className="text-default-600 text-base my-2">
                    {testimonial.content}
                  </p>
                  <div className="flex items-center gap-3 mt-4">
                    <Image
                      src={avatar}
                      alt={testimonial.name}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-default-500 text-base">
                        {testimonial.role}, {testimonial.location}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation */}
          <button className="testimonial-prev absolute left-4 md:left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors -translate-x-1/2">
            <Icon icon="heroicons:chevron-left" className="w-5 h-5" />
          </button>
          <button className="testimonial-next absolute right-4 md:right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors translate-x-1/2">
            <Icon icon="heroicons:chevron-right" className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.section>
  );
};

export default Testimonial;
