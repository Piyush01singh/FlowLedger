import { AnimatePresence, motion } from "framer-motion";
import { PencilLine, Trash2 } from "lucide-react";
import { formatCurrency, formatDate } from "../utils/format";

function RowSkeleton() {
  return (
    <div className="table-skeleton">
      <span />
      <span />
      <span />
      <span />
    </div>
  );
}

export default function TransactionTable({ transactions, loading, onEdit, onDelete }) {
  return (
    <section className="transactions-panel">
      <header className="panel-headline">
        <div>
          <h2>Transactions</h2>
          <p>Manage income and expenses with instant edit and delete actions.</p>
        </div>
      </header>

      {loading ? (
        <div className="skeleton-stack">
          <RowSkeleton />
          <RowSkeleton />
          <RowSkeleton />
        </div>
      ) : null}

      {!loading && transactions.length === 0 ? (
        <div className="empty-state">
          <h3>No transactions found</h3>
          <p>Try changing filters or add your first transaction.</p>
        </div>
      ) : null}

      {!loading && transactions.length > 0 ? (
        <div className="table-scroll">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence initial={false}>
                {transactions.map((transaction) => (
                  <motion.tr
                    key={transaction.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <td>
                      <div className="title-cell">
                        <strong>{transaction.title}</strong>
                        {transaction.note ? <small>{transaction.note}</small> : null}
                      </div>
                    </td>
                    <td>
                      <span
                        className={
                          transaction.type === "income" ? "amount-chip income" : "amount-chip expense"
                        }
                      >
                        {transaction.type === "income" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </span>
                    </td>
                    <td>{transaction.category}</td>
                    <td>{formatDate(transaction.date)}</td>
                    <td>
                      <div className="table-actions">
                        <button
                          type="button"
                          className="icon-btn subtle"
                          onClick={() => onEdit(transaction)}
                          aria-label={`Edit ${transaction.title}`}
                        >
                          <PencilLine size={16} />
                        </button>
                        <button
                          type="button"
                          className="icon-btn subtle danger"
                          onClick={() => onDelete(transaction.id)}
                          aria-label={`Delete ${transaction.title}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}
