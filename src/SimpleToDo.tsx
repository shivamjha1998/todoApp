import React, { useState } from "react";
import { Todo, Notification } from "./App";
import SvgDefs from "./components/SvgDefs";

interface SimpleToDoProps {
  todos: Todo[];
  onAddTodo: (title: string) => void;
  onToggleTodo: (id: string, completed: boolean) => void;
  onDeleteTodo: (id: string) => void;
  notifications: Notification[];
  showNotification: (
    message: string,
    type: "added" | "completed" | "deleted"
  ) => void;
}

export default function SimpleToDo({
  todos,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
  notifications,
  showNotification,
}: SimpleToDoProps) {
  const [newItem, setNewItem] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<
    "All" | "Done" | "Undone"
  >("All");
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newItem.trim()) return;

    onAddTodo(newItem.trim());
    setNewItem("");
  }

  function toggleMenu(id: string) {
    setMenuOpen(menuOpen === id ? null : id);
  }

  const filteredTodos = todos.filter((todo) => {
    if (selectedFilter === "Done") return todo.completed;
    if (selectedFilter === "Undone") return !todo.completed;
    return true;
  });

  const completedCount = todos.filter((t) => t.completed).length;
  const completedPercentage =
    todos.length > 0 ? Math.round((completedCount / todos.length) * 100) : 0;

  return (
    <div className="app-card">
      <SvgDefs />
      <div className="progress-container">
        <div className="progress-text">Progress</div>
        <div className="progress-bar-container">
          <div
            className={`progress-bar ${
              completedPercentage === 100 ? "complete" : ""
            }`}
            style={{ width: `${completedPercentage}%` }}
          />
        </div>
        <div>{completedCount} completed</div>
      </div>

      <div className="header-container">
        <h1 className="header">To-dos</h1>
        <select
          value={selectedFilter}
          onChange={(e) =>
            setSelectedFilter(e.target.value as "All" | "Done" | "Undone")
          }
          className="filter-dropdown"
        >
          <option value="All">All</option>
          <option value="Done">Done</option>
          <option value="Undone">Undone</option>
        </select>
      </div>

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

      <ul className="list">
        {filteredTodos.map((todo) => (
          <li key={todo.id} className="todo-list">
            <label className="todo">
              <input
                className="todo__state"
                type="checkbox"
                id={`todo-${todo.id}`}
                checked={todo.completed}
                onChange={(e) => {
                  onToggleTodo(todo.id, e.target.checked);
                  if (e.target.checked && !todo.completed) {
                    showNotification(`Completed: ${todo.title}`, "completed");
                  }
                }}
              />

              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 350 25"
                className="todo__icon"
              >
                <use xlinkHref="#todo__line" className="todo__line" />
                <use xlinkHref="#todo__box" className="todo__box" />
                <use xlinkHref="#todo__check" className="todo__check" />
                <use xlinkHref="#todo__circle" className="todo__circle" />
              </svg>

              <span className="todo__text">{todo.title}</span>
            </label>

            <div className="menu-container">
              <button
                className="menu-button"
                onClick={() => toggleMenu(todo.id)}
              >
                {/* ...three-dot icon is in CSS background... */}
              </button>
              {menuOpen === todo.id && (
                <div className="dropdown-menu">
                  <button onClick={() => onDeleteTodo(todo.id)}>Delete</button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>

      <div className="notifications-container">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`notification notification-${notification.type}`}
          >
            {notification.message}
          </div>
        ))}
      </div>
    </div>
  );
}
