import { useEffect, useState } from "react"
import { TomatoPerDay, loadTomatos } from "./services/tomato"

export function Tomatos() {
  const [tomatos, setTomatos] = useState<TomatoPerDay[]>([])
  useEffect(() => {
    loadTomatos().then(tomatos => {
      console.log(tomatos)
      setTomatos(tomatos)
    }).catch(err => {
      console.error(err)
    })
  }, [])
  return <div>
    {/** Tomatos */}
    <div className="flex flex-col bg-slate-500 text-slate-50 rounded-lg px-2 py-2">
      {tomatos.map((t, i) => <div key={i}>
        <div>{t.day}</div>
        <div className="pl-2">
          {t.tomatos.map((t, j) => <div key={j}>
            {t.task}
          </div> )}
        </div>
      </div>)}
    </div>
  </div>
}
