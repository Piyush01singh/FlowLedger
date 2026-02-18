import { motion } from "framer-motion";
import { formatCurrency } from "../utils/format";

const CHART_COLORS = ["#f8a23b", "#ff6f59", "#31c48d", "#2d7cf6", "#7dd3fc", "#7bbf5f"];

function buildChartGradient(data, total) {
  if (!data.length || total <= 0) {
    return "conic-gradient(#cbd5e1 0% 100%)";
  }

  let cursor = 0;
  const segments = data.slice(0, CHART_COLORS.length).map((item, index) => {
    const share = (item.amount / total) * 100;
    const start = cursor;
    const end = cursor + share;
    cursor = end;
    return `${CHART_COLORS[index]} ${start}% ${end}%`;
  });

  if (cursor < 100) {
    segments.push(`#94a3b8 ${cursor}% 100%`);
  }

  return `conic-gradient(${segments.join(", ")})`;
}

export default function SpendingChart({ breakdown, totalExpenses }) {
  const chartBackground = buildChartGradient(breakdown, totalExpenses);

  return (
    <section className="chart-panel">
      <header className="panel-headline">
        <div>
          <h2>Spending Pulse</h2>
          <p>Quick view of where your money goes this period.</p>
        </div>
      </header>

      {totalExpenses <= 0 ? (
        <div className="empty-state compact">
          <h3>No expense data yet</h3>
          <p>Add expense transactions to unlock category analytics.</p>
        </div>
      ) : (
        <div className="chart-layout">
          <motion.div
            className="donut-wrap"
            initial={{ opacity: 0, rotate: -18 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="donut-chart" style={{ background: chartBackground }}>
              <span>
                <strong>{formatCurrency(totalExpenses)}</strong>
                <small>Total expenses</small>
              </span>
            </div>
          </motion.div>

          <div className="bars-stack">
            {breakdown.slice(0, 6).map((item, index) => {
              const percentage = Math.round((item.amount / totalExpenses) * 100);
              return (
                <motion.div
                  key={item.category}
                  className="bar-row"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.06 }}
                >
                  <div className="bar-head">
                    <span>{item.category}</span>
                    <strong>{formatCurrency(item.amount)}</strong>
                  </div>
                  <div className="bar-track">
                    <motion.span
                      className="bar-fill"
                      style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.45, delay: index * 0.07 }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
