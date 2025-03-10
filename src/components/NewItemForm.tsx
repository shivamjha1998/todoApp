import { useState } from "react";

interface NewItemFormProps {
  onAddTodo: (title: string) => void;
  showNotification: (
    message: string,
    type: "added" | "completed" | "deleted"
  ) => void;
}

export default function NewItemForm({
  onAddTodo,
  showNotification,
}: NewItemFormProps) {
  const [newItem, setNewItem] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newItem.trim()) {
      showNotification(`'text' is empty`, "deleted");
      return;
    }

    onAddTodo(newItem.trim());
    setNewItem("");
  }

  return (
    <form onSubmit={handleSubmit} className="new-item-form">
      <div className="form-row">
        <div className="input-with-button">
          <input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            type="text"
            id="item"
            placeholder="Add your to-do…"
          />
          <button className="btn inside-button" type="submit">
            Add
          </button>
        </div>
      </div>
    </form>
  );
}
