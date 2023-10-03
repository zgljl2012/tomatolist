import { useEffect } from "react"
import { useTomatos } from "./hooks/tomatos"

function padding_zero(s: string) {
  return s.padStart(2, '0')
}

function formatTimestamp(ts: string) {
  const dt = new Date(ts)
  const h = padding_zero(dt.getHours().toString())
  const m = padding_zero(dt.getMinutes().toString())
  const s = padding_zero(dt.getSeconds().toString())
  return `${h}:${m}:${s}`
}

export function Tomatos() {
  const { tomatos, reload} = useTomatos()
  useEffect(() => {
    reload
  }, [])
  return <div>
    {/** Tomatos */}
    <div className="flex flex-col bg-slate-500 text-slate-50 rounded-lg px-2 py-2 overflow-scroll">
      {tomatos.map((t, i) => <div key={i}>
        <div>{t.day}</div>
        <div className="pl-2">
          {t.tomatos.map((t, j) => <div key={j}>
            <div className="text-xs text-slate-300 flex flex-row">
              <div>{formatTimestamp(t.start_at)}</div>
              <div>-</div>
              <div>{formatTimestamp(t.end_at)}</div>
            </div>
            <div>{t.task || '--'}</div>
          </div> )}
        </div>
      </div>)}
    </div>
  </div>
}
