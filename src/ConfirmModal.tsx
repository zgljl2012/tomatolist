import { Modal } from "@cpchain-foundation/ui";
import { useTodos } from "./hooks/todo";
import { useEffect, useState } from "react";
import { Todo } from "./TodoList";
import { finishedTodos } from "./services/todo";
import { createTomato } from "./services/tomato";
import { useTomatos } from "./hooks/tomatos";
import { useTomatoStart } from "./hooks/start_at";

export function FinishedConfirmModal({ active, setActive, onConfirmed }: { active: boolean; setActive: (v: boolean) => void, onConfirmed?: () => void}) {
  const { todos, reload } = useTodos()
  const { reload: reloadTomatos } = useTomatos()
  const [unfinished, setUnfinished] = useState<Todo[]>([])
  const [task, setTask] = useState('')
  useEffect(() => {
    setUnfinished(() => {
      return todos.filter(i => i.finished)
    })
  }, [todos])
  useEffect(() => {
    setTask(unfinished.map(u => u.title).join(' + '))
  }, [unfinished])
  const { startAt } = useTomatoStart()
  return <Modal active={active} setActive={setActive}>
    <div className="bg-slate-950 flex flex-col gap-4 rounded-xl shadow-lg text-slate-50 p-4">
      {/** Task */}
      <input className="px-1 py-1 rounded-md outline-none bg-slate-900" value={task} onChange={e => {
        setTask(e.target.value)
      }}></input>
      {/** TODOS */}
      <div className="flex flex-col gap-2">
        {unfinished.map(t => <div key={t.id} className="line-through">
          {t.title}
        </div>)}
      </div>
      {/** button */}
      <form onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        const end_at = new Date().getTime() / 1000
        createTomato(startAt, end_at, task).then(() => {
          return finishedTodos(...unfinished)
        }).then(() => {
          setActive(false)
          reload()
          reloadTomatos()
          onConfirmed && onConfirmed()
        }).catch(err => {
          console.error(err)
        })
      }}>
        <div className="w-full flex flex-col gap-2">
          <button disabled={!task} type="submit" className="rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-slate-50 w-full bg-violet-500 text-xs px-3 py-2">Confirm</button>
          <button onClick={() => {
            setActive(false)
          }} className="text-slate-50 text-xs hover:text-violet-400">Cancel</button>
        </div>
      </form>
    </div>
  </Modal>
}
