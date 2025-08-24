import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import faq from "@/public/images/home/faq-img.png";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const faqs = [
  {
    question: "How do I book an appointment with a doctor?",
    id: 1,
    answer: (
      <p className="text-base">
        A{" "}
        <Link
          href="https://themeforest.net/licenses/terms/regular"
          target="_blank"
          className="text-primary"
        >
          Regular License
        </Link>{" "}
        Yes, simply visit our website and log in or create an account. Search
        for a doctor based on specialization, location, or availability &
        confirm your booking.
      </p>
    ),
  },

  {
    question: "  Can I request a specific doctor when booking my appointment?",
    id: 2,
    answer:
      "Yes, you can usually request a specific doctor when booking your appointment, though availability may vary based on their schedule.",
  },
  {
    question:
      "What should I do if I need to cancel or reschedule my appointment?",
    id: 3,
    answer:
      "If you need to cancel or reschedule your appointment, contact the doctor as soon as possible to inform them and to reschedule for another available time slot.",
  },
  {
    question: "What if I'm running late for my appointment?",
    id: 4,
    answer:
      "If you know you will be late, it's courteous to call the doctor's office and inform them. Depending on their policy and schedule, they may be able to accommodate you or reschedule your appointment.",
  },
  {
    question: "Can I book appointments for family members or dependents?",
    id: 5,
    answer:
      "Yes, in many cases, you can book appointments for family members or dependents. However, you may need to provide their personal information and consent to do so.",
  },
];

const Faq = () => {
  return (
    <section className=" bg-card/30  py-16 lg:py-20">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="container"
      >
        <div className="  mx-auto mb-14">
          <div className="text-center text-xl xl:text-3xl xl:leading-[46px] font-semibold text-default-900 mb-3">
            <h1 className="text-xl lg:text-2xl font-medium text-primary">
              FAQs
            </h1>
          </div>
          <p className="text-base xl:leading-7 text-center text-default-700">
            <strong>Got Questions?</strong> We've compiled a list of answers to
            your frequently asked questions. If you can't find what you're
            looking for here, don't hesitate to reach out to us.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 items-center gap-y-6">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="hidden lg:block"
          >
            <Image src={faq} alt="" width={600} height={400} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <Accordion type="single" collapsible className="space-y-6">
              {faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.4,
                    delay: i * 0.1,
                    ease: "easeInOut",
                  }}
                >
                  <AccordionItem
                    value={`item-${i}`}
                    className="   dark:bg-muted text-default-900"
                  >
                    <AccordionTrigger className="text-left font-medium">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-default-800">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Faq;
