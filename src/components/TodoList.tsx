"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox"; // 👈 New import

interface Todo {
  _id: string;
  title: string;
  completed: boolean;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");

  const fetchTodos = async () => {
    const res = await fetch("/api/todos");
    const data = await res.json();
    if (data.success) setTodos(data.data);
  };

  const addTodo = async () => {
    if (!newTodo.trim()) return;
    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTodo }),
    });
    if (res.ok) {
      setNewTodo("");
      fetchTodos();
    }
  };

  const toggleTodo = async (id: string, completed: boolean, title: string) => {
    await fetch(`/api/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed, title }),
    });
    fetchTodos();
  };

  const deleteTodo = async (id: string) => {
    await fetch(`/api/todos/${id}`, { method: "DELETE" });
    fetchTodos();
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <Card className="bg-[#111111] border-green-500/30 rounded-2xl shadow-lg p-6 max-w-lg mx-auto my-12">
      <CardHeader className="border-b border-gray-700 pb-4 mb-4">
        <CardTitle className="text-green-400 text-3xl font-bold tracking-tight text-center">
          Todo List
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-6">
          <Input
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new task..."
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            className="flex-1 bg-black text-white placeholder:text-gray-500 border-gray-700 focus:border-green-500 transition-colors"
          />
          <Button onClick={addTodo} className="bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors">
            Add
          </Button>
        </div>

        {todos.length > 0 ? (
          <ul className="space-y-4 text-white">
            {todos.map((todo) => (
              <li
                key={todo._id}
                className="flex items-center justify-between gap-4 p-3 bg-[#1a1a1a] rounded-lg border border-gray-800 transition-all hover:border-green-500/50"
              >
                <div className="flex items-center gap-3 flex-1">
                  <Checkbox
                    id={todo._id}
                    checked={todo.completed}
                    onCheckedChange={() =>
                      toggleTodo(todo._id, todo.completed, todo.title)
                    }
                    className="w-5 h-5 border-gray-600 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500 transition-colors"
                  />
                  <label
                    htmlFor={todo._id}
                    className={`flex-1 text-base leading-none cursor-pointer ${
                      todo.completed ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {todo.title}
                  </label>
                </div>
                <Button
                  onClick={() => deleteTodo(todo._id)}
                  variant="ghost"
                  className="text-gray-400 hover:bg-red-500/20 hover:text-red-400 p-2 h-auto rounded-full transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <line x1="10" x2="10" y1="11" y2="17" />
                    <line x1="14" x2="14" y1="11" y2="17" />
                  </svg>
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-center py-8">
            Start by adding a task! 🚀
          </p>
        )}
      </CardContent>
    </Card>
  );
}