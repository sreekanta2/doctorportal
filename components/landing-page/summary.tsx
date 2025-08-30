"use client";
import work from "@/public/images/all-img/work-img.png";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Summary() {
  return (
    <div className=" bg-card/30 py-16 lg:py-20  dark:shadow-sm ">
      <div className="container text-center mb-12">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4"
        >
          How It Works
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
        >
          Discover how our platform connects you with trusted doctors and
          clinics. Search for specialists, book appointments, track your medical
          history, and read real patient reviews — all in one place.
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
                text: "Find your doctor, check their weekly schedule, and see real patient reviews before booking.",
                color: "bg-blue-100 dark:bg-blue-900/30",
              },
              {
                icon: "heroicons:document-arrow-up",
                title: "Upload Medical History",
                text: "Upload your medical reports and prescriptions to your booked doctor and keep track of your personalized treatment history.",
                color: "bg-purple-100 dark:bg-purple-900/30",
              },

              {
                icon: "heroicons:building-office",
                title: "Manage Clinic Profile",
                text: "Add doctors, set their schedules, control membership, fees, and maximum appointments — full control over your clinic operations.",
                color: "bg-blue-100 dark:bg-blue-900/30",
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
