import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./FaqSection.css";

const faqs = [
  {
    question: "How do we register?",
    answer:
      "Visit the events page and fill out the Google Form for the event you wish to participate in. Non-IIITB students must complete the payment and upload the receipt. IIITB students should upload their student ID.",
  },
  {
    question: "How do I verify my identity?",
    answer:
      "IIITB students must carry their ID card. Non-IIITB students will receive a confirmation email after payment, which will be used for verification.",
  },
  {
    question: "Do I need separate tickets for each event?",
    answer:
      "One event ticket grants campus entry for the day, but you must register separately for additional events.",
  },
  {
    question: "How will I get event updates?",
    answer:
      "Updates will be shared through event SPOCs and on Instagram @infin8_iiitb.",
  },
  {
    question: "Are sponsorship opportunities available?",
    answer:
      "Yes. Please contact sac@iiitb.ac.in for sponsorship and collaboration details.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="faq-section">
      <div className="faq-header">
        <h2 className="faq-title">FAQ</h2>
        <p className="faq-subtitle">
          Everything you need to know about INFIN8 2026
        </p>
      </div>

      <div className="faq-container">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <button
              className="faq-question"
              onClick={() =>
                setOpenIndex(openIndex === index ? null : index)
              }
            >
              <span>{faq.question}</span>
              <motion.span
                animate={{ rotate: openIndex === index ? 45 : 0 }}
                className="faq-icon"
              >
                +
              </motion.span>
            </button>

            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="faq-answer"
                >
                  <p>{faq.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}