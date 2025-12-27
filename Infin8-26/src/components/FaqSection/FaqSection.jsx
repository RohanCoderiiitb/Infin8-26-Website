import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../assets/Faq-design.gif"
import arrow from "../../assets/arrow.png"
import "./FaqSection.css";

const faqs = [
  {
    question: "How do we register?",
    answer:
      "Visit the events page and fill out the Google Form for the event you wish to participate in. A QR code is available in the form. Non-IIITB students should scan the QR code, complete the payment, take a screenshot of the receipt, and submit it through the form. IIITB students are exempt from event fees; however, they should also upload a picture of their student ID as part of the registration process.",
  },
  {
    question: "How do I verify my identity?",
    answer:
      "If you are an IIITB student, please carry your ID card. For non-IIITB students, we will verify your payment and send you the tickets to the email address you provided in the form. This email confirmation will be considered as your identity verification",
  },
  {
    question: "Do I need separate tickets for each event?",
    answer:
      "One ticket for any of the events is enough to get you into the college for the day the event is happening, but for participating in any other event, you would still have to pay.",
  },
  {
    question: "How will I get event updates?",
    answer:
      "You can get updates of each event by contacting one of the SPOCS of the event or by following @infin8_iiitb on Instagram.",
  },
  {
    question: "Are sponsorship opportunities available?",
    answer:
      "Yes, there are many. You can contact us at sac@iiitb.ac.in for more details.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const imageVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8 } },
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, y: 0, transition: { duration: 0.8, staggerChildren: 0.1 }
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <section className="faq-section">
      <motion.div
        className="left-side"
        variants={imageVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="faq-image">
          <img src={logo} alt="FAQ Image"/>
        </div>
      </motion.div>

      <motion.div
        className="right-side"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="faq-header">
          <h2 className="faq-title">FAQ's</h2>
        </div>

        <div className="faq-scrollbar">
          <div className="faq-container">
            {faqs.map((faq, index) => (
              <motion.div key={index} variants={itemVariants} className="faq-item">
                <button
                  className="faq-question"
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                >
                  <span>{faq.question}</span>
                  <motion.span
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    className="faq-icon"
                  >
                    <img src={arrow} alt="Down Arrow" loading="lazy"/>
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
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}