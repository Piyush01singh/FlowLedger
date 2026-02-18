import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Landmark } from "lucide-react";
import { formatCurrency } from "../utils/format";

export default function SummaryCards({ balance, income, expense }) {
  const cards = [
    {
      id: "balance",
      label: "Total Balance",
      value: formatCurrency(balance),
      icon: <Landmark size={18} />,
      className: "balance"
    },
    {
      id: "income",
      label: "Income",
      value: formatCurrency(income),
      icon: <ArrowUpRight size={18} />,
      className: "income"
    },
    {
      id: "expense",
      label: "Expenses",
      value: formatCurrency(expense),
      icon: <ArrowDownRight size={18} />,
      className: "expense"
    }
  ];

  return (
    <section className="summary-grid">
      {cards.map((card, index) => (
        <motion.article
          key={card.id}
          className={`summary-card ${card.className}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + index * 0.06, duration: 0.35 }}
          whileHover={{ y: -4, scale: 1.01 }}
        >
          <header>
            <span className="card-icon">{card.icon}</span>
            <p>{card.label}</p>
          </header>
          <h3>{card.value}</h3>
        </motion.article>
      ))}
    </section>
  );
}
