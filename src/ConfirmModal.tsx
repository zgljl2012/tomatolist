import { Modal } from "@cpchain-foundation/ui";
import { useTodos } from "./hooks/todo";
import { useEffect, useState } from "react";
import { Todo } from "./TodoList";
import { finishedTodos } from "./services/todo";

export function FinishedConfirmModal({ active, setActive, onConfirmed }: { active: boolean; setActive: (v: boolean) => void, onConfirmed?: () => void}) {
  const { todos, reload } = useTodos()
  const [unfinished, setUnfinished] = useState<Todo[]>([])
  useEffect(() => {
    setUnfinished(() => {
      return todos.filter(i => i.finished)
    })
  }, [todos])
  return <Modal active={active} setActive={setActive}>
    <div className="bg-slate-950 flex flex-col gap-4 rounded-xl shadow-lg text-slate-50 p-4">
      {/** TODOS */}
      <div className="flex flex-col gap-2">
        {unfinished.map(t => <div key={t.id} className="line-through">
          {t.title}
        </div>)}
      </div>
      {/** button */}
      <div className="w-full flex flex-col gap-2">
        <button onClick={() => {
          finishedTodos(...unfinished).then(() => {
            setActive(false)
            reload()
            onConfirmed && onConfirmed()
          }).catch(err => {
            console.error(err)
          })
        }} className="rounded-lg text-slate-50 w-full bg-violet-500 text-xs px-3 py-2">Confirm</button>
        <button onClick={() => {
          setActive(false)
        }} className="text-slate-50 text-xs hover:text-violet-400">Cancel</button>
      </div>
    </div>
  </Modal>
}
