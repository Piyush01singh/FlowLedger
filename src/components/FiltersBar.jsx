import { RotateCcw, Search, SlidersHorizontal } from "lucide-react";

export default function FiltersBar({ filters, categories, onChange, onReset }) {
  return (
    <section className="filters-panel">
      <header className="panel-headline">
        <div>
          <h2>Filters & Search</h2>
          <p>Find transactions instantly by keyword, type, or category.</p>
        </div>
        <span className="panel-icon">
          <SlidersHorizontal size={16} />
        </span>
      </header>

      <div className="filters-grid">
        <label className="field">
          <span>Search</span>
          <div className="input-with-icon">
            <Search size={15} />
            <input
              type="text"
              placeholder="Search title, category, note..."
              value={filters.query}
              onChange={(event) => onChange({ ...filters, query: event.target.value })}
            />
          </div>
        </label>

        <label className="field">
          <span>Type</span>
          <select
            value={filters.type}
            onChange={(event) => onChange({ ...filters, type: event.target.value })}
          >
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </label>

        <label className="field">
          <span>Category</span>
          <select
            value={filters.category}
            onChange={(event) => onChange({ ...filters, category: event.target.value })}
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <button type="button" className="btn-secondary reset-btn" onClick={onReset}>
          <RotateCcw size={14} />
          Reset
        </button>
      </div>
    </section>
  );
}
