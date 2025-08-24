"use client";
import work from "@/public/images/all-img/work-img.png";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Summary() {
  return (
    <div className=" bg-card/30 py-16 lg:py-20  dark:shadow-sm ">
      <div className=" container text-center mb-12  ">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4"
        >
          Our Process
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
        >
          Explore our comprehensive range of medical specialties with top-tier
          healthcare professionals
        </motion.p>
      </div>

      <div className="container grid lg:grid-cols-2 gap-8   ">
        {/* Image Section */}
        <motion.div
          className="hidden  md:flex items-end justify-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Image
            src={work}
            width={500}
            height={500}
            alt="Doctor consultation"
            className="object-contain max-h-[400px]"
            priority
          />
        </motion.div>

        {/* Content Section */}
        <div className="flex flex-col justify-center">
          <div className="space-y-4">
            {[
              {
                icon: "heroicons:magnifying-glass",
                title: "Find Your Doctor",
                text: "Search by specialty, location, or availability to find the right healthcare professional.",
                color: "bg-blue-100 dark:bg-blue-900/30",
              },
              {
                icon: "heroicons:user-circle",
                title: "Review Profiles",
                text: "Explore detailed profiles including qualifications, experience, and patient reviews.",
                color: "bg-purple-100 dark:bg-purple-900/30",
              },
              {
                icon: "heroicons:calendar-days",
                title: "Book Appointment",
                text: "Select your preferred time slot with our easy-to-use scheduling system.",
                color: "bg-green-100 dark:bg-green-900/30",
              },
              {
                icon: "heroicons:chat-bubble-left-right",
                title: "Receive Care",
                text: "Get personalized medical advice and treatment from the comfort of your home.",
                color: "bg-orange-100 dark:bg-orange-900/30",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-5 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.15 }}
              >
                <div
                  className={`flex-shrink-0 w-12 h-12 ${step.color} rounded-lg flex items-center justify-center`}
                >
                  <Icon icon={step.icon} className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-primary-500 bg-primary-50 dark:bg-primary-900/20 px-2 py-1 rounded">
                      Step {index + 1}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    {step.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
