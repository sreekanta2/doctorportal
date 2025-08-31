"use client";
import { Hero } from "@/components/hero";
import BestDoctors from "@/components/landing-page/best-doctors";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

export default function AboutUs() {
  return (
    <>
      <Head>
        <title>About Us | MedCare HMS</title>
        <meta
          name="description"
          content="Discover MedCare HMS – a modern healthcare platform that connects patients, doctors, and clinics seamlessly."
        />
      </Head>

      <Hero
        title={<span className="text-primary">About Us</span>}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About Us" }]}
      />

      <main className="bg-card/50 backdrop-blur-lg shadow-md dark:bg-card/70">
        {/* Our Story */}
        <section className="py-20 bg-background dark:bg-[#0e1527]">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="md:w-1/2"
              >
                <h2 className="text-3xl font-bold text-default-800 mb-6">
                  Our Story
                </h2>
                <p className="text-lg text-default-600 mb-4">
                  MedCare HMS was founded to simplify healthcare services by
                  bridging the gap between patients, doctors, and clinics.
                  Instead of struggling with appointments, availability, or
                  records, we provide one seamless platform to manage everything
                  in a smarter way.
                </p>
                <p className="text-lg text-default-600">
                  Today, MedCare helps thousands of patients find trusted
                  doctors, book consultations, access reports, and manage
                  prescriptions—all in one place.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="md:w-1/2 bg-default-100 rounded-xl overflow-hidden"
              >
                <Image
                  src="/images/about.png"
                  alt="Hospital team discussing"
                  className="w-full h-auto object-cover"
                  width={600}
                  height={400}
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features / Mission */}
        <section className="py-20 bg-background/10">
          <div className="container mx-auto px-6">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-center text-default-800 mb-16"
            >
              What We Offer
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: "healthicons:doctor",
                  title: "Doctor Search",
                  description:
                    "Find doctors by specialty, clinic, or availability and view their full profiles.",
                },
                {
                  icon: "mdi:calendar-clock",
                  title: "Schedules & Availability",
                  description:
                    "Check clinic timings, consultation fees, and book appointments instantly.",
                },
                {
                  icon: "carbon:collaborate",
                  title: "Clinic Search",
                  description:
                    "Search for clinics, explore available doctors, and compare services easily.",
                },
                {
                  icon: "mdi:comment-text-multiple",
                  title: "Real Patient Feedback",
                  description:
                    "Read verified reviews to choose the right doctor with confidence.",
                },
                {
                  icon: "mdi:file-document-multiple",
                  title: "Reports & Prescriptions",
                  description:
                    "Patients can securely store and access medical reports and prescriptions online.",
                },
                {
                  icon: "icon-park-outline:innovation",
                  title: "Smart Healthcare Platform",
                  description:
                    "A complete system designed to simplify healthcare for both patients and providers.",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="bg-card p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="text-blue-600 mb-4">
                    <Icon icon={item.icon} className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-semibold text-default-800 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-default-600">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Leadership */}
        <BestDoctors />

        {/* CTA */}
        <section className="py-20 bg-blue-900 text-white">
          <div className="container mx-auto px-6 text-center">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-8"
            >
              Ready to Experience Smarter Healthcare?
            </motion.h2>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Link
                href={`/doctors`}
                className="px-8 py-3 bg-white text-blue-900 font-medium rounded-lg hover:bg-default-100 transition-colors"
              >
                Explore Doctors
              </Link>
              <Link
                href={`/clinics`}
                className="px-8 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-blue-900 transition-colors"
              >
                Find a Clinic
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
