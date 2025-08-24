"use client";
import { Hero } from "@/components/hero";
import BestDoctors from "@/components/landing-page/best-doctors";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import Head from "next/head";

export default function AboutUs() {
  return (
    <>
      <Head>
        <title>About Us | MedCare HMS</title>
        <meta
          name="description"
          content="Learn about MedCare Hospital Management System and our mission to revolutionize healthcare administration"
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
                  Founded in 2010 by a team of healthcare professionals and
                  technology experts, MedCare HMS began with a simple mission:
                  to eliminate administrative burdens so medical staff can focus
                  on what matters most - patient care.
                </p>
                <p className="text-lg text-default-600">
                  What started as a small startup has grown into the leading
                  hospital management platform, serving over 500 healthcare
                  facilities across 12 countries.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="md:w-1/2 bg-default-100 rounded-xl overflow-hidden"
              >
                <img
                  src="/images/hospital-team.jpg"
                  alt="Hospital team discussing"
                  className="w-full h-auto object-cover"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Mission and Values */}
        <section className="py-20 bg-background/10">
          <div className="container mx-auto px-6">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-center text-default-800 mb-16"
            >
              Our Mission & Values
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: "healthicons:doctor",
                  title: "Patient-Centered",
                  description:
                    "We design our systems with patient outcomes as the top priority.",
                },
                {
                  icon: "carbon:collaborate",
                  title: "Collaborative",
                  description:
                    "We work closely with healthcare providers to understand their needs.",
                },
                {
                  icon: "icon-park-outline:innovation",
                  title: "Innovative",
                  description:
                    "We continuously evolve our technology to meet industry changes.",
                },
                {
                  icon: "carbon:security",
                  title: "Secure",
                  description:
                    "Patient data security is at the core of everything we build.",
                },
                {
                  icon: "carbon:data-vis-1",
                  title: "Data-Driven",
                  description:
                    "Our decisions are guided by analytics and real-world evidence.",
                },
                {
                  icon: "carbon:user-certification",
                  title: "Compliant",
                  description:
                    "We maintain the highest standards of regulatory compliance.",
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
              Ready to Transform Your Hospital Management?
            </motion.h2>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <button className="px-8 py-3 bg-white text-blue-900 font-medium rounded-lg hover:bg-default-100 transition-colors">
                Request a Demo
              </button>
              <button className="px-8 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-blue-900 transition-colors">
                Contact Sales
              </button>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
