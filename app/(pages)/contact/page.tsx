"use client";
import { Hero } from "@/components/hero";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  interface InputChangeEvent
    extends React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> {}

  const handleChange = (e: InputChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prev: ContactFormData) => ({
      ...prev,
      [name]: value,
    }));
  };

  interface ContactFormData {
    name: string;
    email: string;
    subject: string;
    message: string;
  }

  interface FormEvent extends React.FormEvent<HTMLFormElement> {}

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Handle form submission

    // Reset form
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <>
      <Hero
        title={<span className="text-primary">Contact Us</span>}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact Us" }]}
      />
      <main className="bg-card/50 backdrop-blur-lg shadow-md dark:bg-card/70">
        {/* Contact Information */}
        <section className="py-20 bg-background">
          <div className="container ">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-center text-default-800 mb-16"
            >
              Get in Touch
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Contact Card - Address */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-card p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-blue-600 mb-4">
                  <Icon icon="mdi:map-marker" className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-semibold text-default-800 mb-3">
                  Our Headquarters
                </h3>
                <p className="text-default-600 mb-2">
                  123 Healthcare Plaza, Suite 500
                </p>
                <p className="text-default-600">San Francisco, CA 94107</p>
              </motion.div>

              {/* Contact Card - Phone */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-card p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-blue-600 mb-4">
                  <Icon icon="mdi:phone" className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-semibold text-default-800 mb-3">
                  Phone Numbers
                </h3>
                <p className="text-default-600 mb-2">
                  <strong>Sales:</strong> (555) 123-4567
                </p>
              </motion.div>

              {/* Contact Card - Email */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-card p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-blue-600 mb-4">
                  <Icon icon="mdi:email" className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-semibold text-default-800 mb-3">
                  Email Addresses
                </h3>
                <p className="text-default-600 mb-2">
                  <strong>General:</strong> info@medcarehms.com
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-20 bg-background/10">
          <div className="container   ">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-card p-8 md:p-12 rounded-xl shadow-sm"
            >
              <h2 className="text-3xl font-bold text-default-800 mb-8">
                Send Us a Message
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-default-700 mb-2"
                    >
                      Full Name
                    </label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      size={"xl"}
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-default-700 mb-2"
                    >
                      Email Address
                    </label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      size={"xl"}
                      required
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="subject"
                    className="block text-default-700 mb-2"
                  >
                    Subject
                  </label>
                  <Input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    size={"xl"}
                    required
                  />
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="message"
                    className="block text-default-700 mb-2"
                  >
                    Your Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    required
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Send Message
                </motion.button>
              </form>
            </motion.div>
          </div>
        </section>

        {/* Map */}
        <section className="py-16 bg-background">
          <div className="container">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="rounded-xl overflow-hidden shadow-lg"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.138053618954!2d-122.4194155846823!3d37.77492997975938!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80859a6d00690021%3A0x4a501367f076adff!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
                width="100%"
                height="450"
                style={{ border: 0 }}
                aria-hidden="false"
                loading="lazy"
                title="MedCare HMS Location"
              ></iframe>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
