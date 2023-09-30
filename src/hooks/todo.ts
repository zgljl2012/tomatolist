import { useEffect } from "react";
import { Todo } from "../TodoList";
import { listTodos } from "../services/todo";
import { atom, useRecoilState } from "recoil";

const todosState = atom<Todo[]>({
  default: [],
  key: "todos_state",
})

export function useTodos() {
  const [todos, setTodos] = useRecoilState(todosState);
  function reload() {
    listTodos()
      .then((values) => {
        setTodos(values);
      })
      .catch((err) => {
        console.error(err);
      });
  }
  useEffect(() => {
    reload()
  }, []);
  return {
    todos, reload
  }
}
