const API_BASE_URL = "https://nanameue-front-end-candidate-test.vercel.app";

interface Todo {
  _id: string;
  text: string;
  isDone: boolean;
  created_at: number;
  username: string;
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export const api = {
  async request<T>(url: string, options: RequestInit): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        return { error: `HTTP error! status: ${response.status}` };
      }
      const data = await response.json();
      return { data };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  async listTodos(username: string): Promise<ApiResponse<Todo[]>> {
    return this.request<Todo[]>(`${API_BASE_URL}/api/${username}/todos`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  },

  async createTodo(username: string, text: string): Promise<ApiResponse<Todo>> {
    return this.request<Todo>(`${API_BASE_URL}/api/${username}/todos/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });
  },

  async toggleTodo(
    username: string,
    todoId: string
  ): Promise<ApiResponse<Todo>> {
    return this.request<Todo>(
      `${API_BASE_URL}/api/${username}/todos/${todoId}/toggle`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  },

  async deleteTodo(
    username: string,
    todoId: string
  ): Promise<ApiResponse<void>> {
    return this.request<void>(
      `${API_BASE_URL}/api/${username}/todos/${todoId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  },
};

export function validateUsername(username: string): boolean {
  return /^[a-z0-9]{3,20}$/.test(username);
}
