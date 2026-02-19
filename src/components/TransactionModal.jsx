import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

const PRESET_CATEGORIES = [
  "Salary",
  "Investments",
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Health",
  "Freelance",
  "Entertainment",
  "Other"
];

const getToday = () => new Date().toISOString().slice(0, 10);

const defaultState = {
  title: "",
  amount: "",
  type: "expense",
  category: "Food",
  date: getToday(),
  note: ""
};

export default function TransactionModal({
  isOpen,
  editingTransaction,
  onClose,
  onSubmit,
  isSubmitting
}) {
  const [form, setForm] = useState(defaultState);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    if (editingTransaction) {
      setForm({
        title: editingTransaction.title || "",
        amount: String(editingTransaction.amount || ""),
        type: editingTransaction.type || "expense",
        category: editingTransaction.category || "Other",
        date: editingTransaction.date || getToday(),
        note: editingTransaction.note || ""
      });
      return;
    }
    setForm(defaultState);
  }, [editingTransaction, isOpen]);

  const title = useMemo(
    () => (editingTransaction ? "Edit Transaction" : "Add New Transaction"),
    [editingTransaction]
  );

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(form);
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="modal-card"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            onClick={(event) => event.stopPropagation()}
          >
            <header className="modal-header">
              <h3>{title}</h3>
              <button type="button" className="icon-btn subtle" onClick={onClose} aria-label="Close modal">
                <X size={16} />
              </button>
            </header>

            <form className="form-grid" onSubmit={handleSubmit}>
              <label className="field">
                <span>Title</span>
                <input
                  required
                  type="text"
                  value={form.title}
                  onChange={(event) => handleChange("title", event.target.value)}
                  placeholder="Rent, Salary, Groceries..."
                />
              </label>

              <label className="field">
                <span>Amount (INR)</span>
                <input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.amount}
                  onChange={(event) => handleChange("amount", event.target.value)}
                  placeholder="0.00"
                />
              </label>

              <label className="field">
                <span>Type</span>
                <select value={form.type} onChange={(event) => handleChange("type", event.target.value)}>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </label>

              <label className="field">
                <span>Category</span>
                <select
                  value={form.category}
                  onChange={(event) => handleChange("category", event.target.value)}
                >
                  {PRESET_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span>Date</span>
                <input
                  required
                  type="date"
                  value={form.date}
                  onChange={(event) => handleChange("date", event.target.value)}
                />
              </label>

              <label className="field full-width">
                <span>Note (Optional)</span>
                <textarea
                  rows={3}
                  value={form.note}
                  onChange={(event) => handleChange("note", event.target.value)}
                  placeholder="Any details to remember..."
                />
              </label>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : editingTransaction ? "Save Changes" : "Add Transaction"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
