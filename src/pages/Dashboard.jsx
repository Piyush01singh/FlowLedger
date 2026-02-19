import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import SummaryCards from "../components/SummaryCards";
import FiltersBar from "../components/FiltersBar";
import SpendingChart from "../components/SpendingChart";
import TransactionTable from "../components/TransactionTable";
import TransactionModal from "../components/TransactionModal";
import { useTransactions } from "../hooks/useTransactions";
import { useAuth } from "../context/AuthContext";

const defaultFilters = {
  query: "",
  type: "all",
  category: "all"
};

export default function Dashboard({ openAddSignal }) {
  const { user } = useAuth();
  const { transactions, loading, error, mode, addTransaction, editTransaction, removeTransaction } =
    useTransactions(user);
  const [filters, setFilters] = useState(defaultFilters);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (openAddSignal > 0) {
      setEditingTransaction(null);
      setIsModalOpen(true);
    }
  }, [openAddSignal]);

  const categories = useMemo(
    () =>
      Array.from(new Set(transactions.map((item) => item.category).filter(Boolean))).sort((a, b) =>
        a.localeCompare(b)
      ),
    [transactions]
  );

  const filteredTransactions = useMemo(() => {
    const query = filters.query.trim().toLowerCase();
    return transactions.filter((transaction) => {
      const matchesQuery =
        !query ||
        transaction.title.toLowerCase().includes(query) ||
        transaction.category.toLowerCase().includes(query) ||
        (transaction.note || "").toLowerCase().includes(query);

      const matchesType = filters.type === "all" ? true : transaction.type === filters.type;
      const matchesCategory =
        filters.category === "all" ? true : transaction.category === filters.category;

      return matchesQuery && matchesType && matchesCategory;
    });
  }, [filters, transactions]);

  const summary = useMemo(() => {
    let income = 0;
    let expense = 0;
    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        income += Number(transaction.amount) || 0;
      } else {
        expense += Number(transaction.amount) || 0;
      }
    });
    return {
      income,
      expense,
      balance: income - expense
    };
  }, [transactions]);

  const expenseBreakdown = useMemo(() => {
    const map = new Map();
    transactions
      .filter((transaction) => transaction.type === "expense")
      .forEach((transaction) => {
        const amount = Number(transaction.amount) || 0;
        map.set(transaction.category, (map.get(transaction.category) || 0) + amount);
      });

    return [...map.entries()]
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  const handleOpenCreate = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    await removeTransaction(id);
  };

  const handleSubmit = async (formValues) => {
    setIsSaving(true);
    try {
      if (editingTransaction) {
        await editTransaction(editingTransaction.id, formValues);
      } else {
        await addTransaction(formValues);
      }
      setIsModalOpen(false);
      setEditingTransaction(null);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="dashboard-page">
      <motion.header
        className="dashboard-hero"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <h1>Your Finance Command Center</h1>
        <p>
          Snapshot balances, filter records, and maintain full control of every transaction from a single
          screen.
        </p>
      </motion.header>

      <SummaryCards balance={summary.balance} income={summary.income} expense={summary.expense} />

      <div className="dashboard-grid">
        <motion.div
          className="panel"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <FiltersBar
            filters={filters}
            categories={categories}
            onChange={setFilters}
            onReset={() => setFilters(defaultFilters)}
          />
          {error ? <p className="form-error">{error}</p> : null}
        </motion.div>

        <motion.div
          className="panel"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
        >
          <SpendingChart
            breakdown={expenseBreakdown}
            totalExpenses={summary.expense}
            transactionCount={transactions.length}
          />
        </motion.div>

        <motion.div
          className="panel panel-wide"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.19 }}
        >
          <TransactionTable
            transactions={filteredTransactions}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </motion.div>
      </div>

      <button type="button" className="floating-add" onClick={handleOpenCreate} aria-label="Add transaction">
        <Plus size={22} />
      </button>

      <TransactionModal
        isOpen={isModalOpen}
        editingTransaction={editingTransaction}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        isSubmitting={isSaving}
      />
    </section>
  );
}
