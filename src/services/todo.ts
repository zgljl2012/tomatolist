import { invoke } from "@tauri-apps/api"
import { Todo } from "../TodoList"

export async function listTodos() {
  const todos = await invoke('load_todos')
  return todos as Todo[]
}

export async function addTodo(title: string): Promise<string> {
  const id: string = await invoke("add_todo", { title })
  return id
}

export async function updateTodo(todo: Todo) {
  await invoke("update_todo", { todo })
}

export async function deleteTodo(id: string) {
  await invoke("delete_todo", { id })
}
