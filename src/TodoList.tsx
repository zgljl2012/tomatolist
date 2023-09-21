import { useState } from "react";

export interface Todo {
    title: string;
    finished?: boolean;
}

function TodoComp({ todo, onDelete, onUpdate }: { todo: Todo, onDelete?: () => void, onUpdate?: (title: string) => void }) {
    const [editable, setEditable] = useState(false)
    return <div className="flex flex-row justify-between items-center w-full">
        <div onKeyDown={e => {
            if (e.key === 'Enter') {
                e.preventDefault()
                e.stopPropagation()
                e.currentTarget.blur()
                setEditable(false)
                const text = (e.target as any).innerHTML
                if (text && text !== '<br>') {
                    onUpdate && onUpdate(text)
                } else if (!text || text === '<br>') {
                    onDelete && onDelete()
                }
            }
        }} contentEditable={editable} onDoubleClick={() => {
            setEditable(true)
        }}>{todo.title}</div>
        <div>
            <button onClick={() => {
                onDelete && onDelete()
            }} className="text-red-500">Del</button>
        </div>
    </div>
}

export function TodoList() {
    const [todos, setTodos] = useState<Todo[]>([])
    const [val, setVal] = useState<string>('')
    return <div className="flex flex-col gap-2 rounded-md bg-slate-400/50 px-4 py-2 w-1/3">
        {/** Buttons */}
        <div className="flex flex-row justify-end border-b pb-2 border-slate-100/20">
            <input value={val} placeholder="Enter new task" onChange={e => setVal(e.target.value)} className="bg-black/50 text-white outline-none rounded-md px-2 py-1 border text-lg" onKeyUp={e => {
                if (e.key === 'Enter') {
                    setTodos([...todos, { title: val, finished: false }])
                    setVal(() => '')
                }
            }}></input>
        </div>
        {/** Todos */}
        {todos.map((todo, i) => <div className="text-white flex flex-row justify-between" key={i}>
            {/** Todo */}
            <TodoComp todo={todo} onUpdate={(title) => {
                console.log(title)
                setTodos(() => {
                    return todos.map((todo, j) => {
                        if (i === j) {
                            return {...todo, title}
                        }
                        return todo
                    })
                })
            }} onDelete={() => {
                setTodos(() => {
                    return todos.filter((_, j) => i !== j)
                })
            }} />
        </div>)}
    </div>
}
