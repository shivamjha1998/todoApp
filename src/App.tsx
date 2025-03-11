import { useEffect, useState } from "react";
import SimpleToDo from "./SimpleToDo";
import GamifiedView from "./GamifiedView";
import "./styles/styles.css";
import { api, validateUsername } from "./api";

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  birdIndex: number;
  positionX: number;
  positionY: number;
}

export interface Notification {
  id: string;
  message: string;
  type: "added" | "completed" | "deleted";
}

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showGame, setShowGame] = useState<boolean>(false);
  const [minimized, setMinimized] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const [username, setUsername] = useState("shivam");

  useEffect(() => {
    if (!validateUsername(username)) {
      console.error("Invalid username");
      return;
    }
    loadTodos(username);
  }, [username]);

  async function loadTodos(user: string) {
    setLoading(true);
    const response = await api.listTodos(user);
    if (response.error) {
      showNotification(response.error, "deleted");
      return;
    }
    if (response.data) {
      const mapped = response.data.map((apiTodo) => ({
        id: apiTodo._id,
        title: apiTodo.text,
        completed: apiTodo.isDone,
        birdIndex: Math.floor(Math.random() * 4),
        positionX: Math.random() * 35 + 25,
        positionY: Math.random() * 60 + 20,
      }));
      setTodos(mapped);
      setLoading(false);
    }
  }

  async function addTodo(title: string) {
    const response = await api.createTodo(username, title);
    if (response.error) {
      showNotification(`Failed to create todo: ${response.error}`, "deleted");
      return;
    }
    if (response.data) {
      const newTodo: Todo = {
        id: response.data._id,
        title: response.data.text,
        completed: response.data.isDone,
        birdIndex: Math.floor(Math.random() * 4),
        positionX: Math.random() * 35 + 25,
        positionY: Math.random() * 60 + 20,
      };
      setTodos((prev) => [...prev, newTodo]);
      showNotification(`Added: ${title}`, "added");
    }
  }

  async function toggleTodo(id: string) {
    const response = await api.toggleTodo(username, id);
    if (response.error) {
      showNotification(`Failed to toggle todo: ${response.error}`, "deleted");
      return;
    }
    if (response.data) {
      const updatedDone = response.data.isDone;
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === response.data?._id
            ? { ...todo, completed: updatedDone }
            : todo
        )
      );
    }
  }

  async function deleteTodo(id: string) {
    const toDelete = todos.find((t) => t.id === id);
    if (toDelete) {
      const isConfirmed = window.confirm(
        `Are you sure you want to delete: ${toDelete.title}?`
      );
      if (!isConfirmed) return;
    }

    const response = await api.deleteTodo(username, id);
    if (response.error) {
      showNotification(`Failed to delete todo: ${response.error}`, "deleted");
      return;
    }
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
    showNotification(`Deleted: ${toDelete?.title}`, "deleted");
  }

  function showNotification(
    message: string,
    type: "added" | "completed" | "deleted"
  ) {
    const newNotification: Notification = {
      id: crypto.randomUUID(),
      message,
      type,
    };
    setNotifications((prev) => [...prev, newNotification]);

    setTimeout(() => {
      setNotifications((prev) =>
        prev.filter((n) => n.id !== newNotification.id)
      );
    }, 2000);
  }

  const handleMinimizeToggle = () => {
    setMinimized(!minimized);
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      {showGame && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
          }}
        >
          <GamifiedView todos={todos} />
        </div>
      )}

      <div
        style={{
          position: "relative",
          zIndex: 2,
          opacity: showGame ? 0.8 : 1,
          display: minimized ? "none" : "block",
          transition: "opacity 0.3s",
        }}
      >
        <SimpleToDo
          todos={todos}
          onAddTodo={addTodo}
          onToggleTodo={toggleTodo}
          onDeleteTodo={deleteTodo}
          notifications={notifications}
          showNotification={showNotification}
          isLoading={loading}
        />
      </div>
      <div className="game-button">
        <button className="btn" onClick={() => setShowGame(!showGame)}>
          {showGame ? "Hide Game" : "Show Game"}
        </button>
        {showGame && (
          <button
            onClick={handleMinimizeToggle}
            className="btn game-todo-button"
          >
            {minimized ? "Show To-Do" : "Minimize To-Do"}
          </button>
        )}
      </div>
    </div>
  );
}
