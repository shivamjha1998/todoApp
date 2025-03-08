import { useState } from "react";
import "./styles.css";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

interface Notification {
  id: string;
  message: string;
  type: "added" | "completed";
}

export default function App() {
  const [newItem, setNewItem] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<
    "All" | "Done" | "Undone"
  >("All");
  const [notifications, setNotifications] = useState<Notification[]>([]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const newTodo = {
      id: crypto.randomUUID(),
      title: newItem,
      completed: false,
    };

    setTodos((currentTodos) => {
      return [...currentTodos, newTodo];
    });
    showNotification(`Added: ${newItem}`, "added");

    setNewItem("");
  }

  function toggleTodo(id: string, completed: boolean) {
    const currentTodo = todos.find((todo) => todo.id === id);

    if (currentTodo && completed && !currentTodo.completed) {
      showNotification(`Completed: ${currentTodo.title}`, "completed");
    }

    setTodos((currentTodos) => {
      return currentTodos.map((todo) => {
        return todo.id === id ? { ...todo, completed } : todo;
      });
    });
  }

  function deleteTodo(id: string) {
    setTodos((currentTodos) => {
      return currentTodos.filter((todo) => todo.id !== id);
    });
  }

  let completedPercentage;
  if (todos.length > 0) {
    completedPercentage = Math.round(
      (todos.filter((todo) => todo.completed).length / todos.length) * 100
    );
  } else completedPercentage = 0;

  const filteredTodos = todos.filter((todo) => {
    if (selectedFilter === "Done") return todo.completed;
    if (selectedFilter === "Undone") return !todo.completed;
    return true;
  });

  function showNotification(message: string, type: "added" | "completed") {
    const newNotification = {
      id: crypto.randomUUID(),
      message,
      type,
    };

    setNotifications((prev) => {
      return [...prev, newNotification];
    });

    const timer = setTimeout(() => {
      setNotifications((prev) =>
        prev.filter((n) => n.id !== newNotification.id)
      );
    }, 2000);

    return () => clearTimeout(timer);
  }

  return (
    <>
      <div className="progress-container">
        <div className="progress-text">Progress ({completedPercentage}%)</div>
        <div
          className={`progress-bar ${
            completedPercentage === 100 ? "complete" : ""
          }`}
          style={{ width: `${completedPercentage}%` }}
        />
      </div>
      <form onSubmit={handleSubmit} className="new-item-form">
        <div className="form-row">
          <label htmlFor="item">New Item</label>
          <input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            type="text"
            id="item"
          />
        </div>
        <button className="btn">Add</button>
      </form>
      <div className="header-container">
        <h1 className="header">Todo List</h1>
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
      <ul className="list">
        {filteredTodos.map((todo) => {
          return (
            <li key={todo.id}>
              <label>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={(e) => toggleTodo(todo.id, e.target.checked)}
                />
                {todo.title}
              </label>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="btn btn-danger"
              >
                Delete
              </button>
            </li>
          );
        })}
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
    </>
  );
}
