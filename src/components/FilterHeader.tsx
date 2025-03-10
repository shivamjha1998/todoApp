interface FilterHeaderProps {
  selectedFilter: "All" | "Done" | "Undone";
  onChangeFilter: (filter: "All" | "Done" | "Undone") => void;
}

export default function FilterHeader({
  selectedFilter,
  onChangeFilter,
}: FilterHeaderProps) {
  return (
    <div className="header-container">
      <h1 className="header">To-dos</h1>
      <select
        value={selectedFilter}
        onChange={(e) =>
          onChangeFilter(e.target.value as "All" | "Done" | "Undone")
        }
        className="filter-dropdown"
      >
        <option value="All">All</option>
        <option value="Done">Done</option>
        <option value="Undone">Undone</option>
      </select>
    </div>
  );
}
