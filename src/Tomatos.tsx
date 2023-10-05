import { useEffect } from "react"
import { useTomatos } from "./hooks/tomatos"
import { Tomato } from "./services/tomato"

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

function totalTime(tomatos: Tomato[]) {
  let secs = 0
  for (const t of tomatos) {
    const s = new Date(t.start_at)
    const e = new Date(t.end_at)
    const duration = Math.floor((e.getTime() - s.getTime()) / 1000)
    secs += duration
  }
  const hour = Math.floor(secs / 60 / 60)
  const minutes = Math.floor((secs - hour * 60 * 60) / 60)
  const seconds = secs - hour * 60 * 60 - minutes * 60
  let r = ''
  if (hour > 0) {
    r += `${hour}h`
  }
  if (minutes > 0) {
    r += `${minutes}m`
  }
  r += `${seconds}s`
  return r
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
        {/** Day */}
        <div className="flex flex-row items-center">
          <span className="text-slate-300">{t.day}</span>
          <label className="text-xs text-slate-400">({totalTime(t.tomatos)})</label>
        </div>
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
