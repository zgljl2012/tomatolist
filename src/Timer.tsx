import clsx from "clsx"
import { ReactNode, useEffect, useState } from "react"
import "./timer.css"

function padding_zero(val: number) {
    if (val >= 10) {
        return '' + val
    }
    return `0${val}`
}

export function Timer({ interval, className }: { interval: number, className?: string  }) {
    const minutes = Math.floor(interval / 60)
    const seconds = interval - minutes * 60
    return <div className={"flex flex-row justify-center items-center gap-1 text-2xl w-[12rem] h-[12rem] rounded-full border-0 border-slate-50 " + className}>
        <div className="w-full h-full relative border-4 border-slate-400 top-0 left-0 flex flex-row justify-center items-center rounded-full">
            <div className="flex flex-row justify-center items-end gap-1 z-50">
                {/** Minutes */}
                <div className="text-4xl">{padding_zero(minutes)}</div>
                <div>:</div>
                {/** Seconds */}
                <div>{padding_zero(seconds)}</div>
            </div>
        </div>
    </div>
}

function Button({ children, onClick, className } : { children: ReactNode, onClick?: () => void, className?: string}) {
    return <button className={clsx('px-3 py-2 rounded-lg text-white', className)} onClick={onClick}>
        {children}
    </button>
}

export function TimerBoard() {
    const tomato_time = 25 * 60
    const [seconds, setSeconds] = useState(tomato_time)
    const [status, setStatus] = useState<'running' | 'timeout' | 'stopped'>('stopped')
    const [colorsMapping] = useState({
        running: 'text-red-400',
        timeout: 'text-red-500',
        stopped: 'text-slate-400',
    })
    useEffect(() => {
        if (seconds === 0 && status === 'running') {
            setStatus('timeout')
            return
        }
        if (status === 'stopped') {
            setSeconds(() => tomato_time)
            return
        }
        if (status === 'running') {
            setTimeout(() => {
                setSeconds(seconds - 1)
            }, 1000)
        }
    }, [seconds, status])
    return <div className="flex flex-col gap-4 items-center">
        {/* <div className="circle_process">
            <div className="wrapper right">
                <div className="circle rightcircle"></div>
            </div>
            <div className="show">Hello</div>
            <div className="wrapper left">
                <div className="circle leftcircle" id="leftcircle"></div>
            </div>
        </div> */}
        {/** 时钟 */}
        <Timer interval={seconds} className={colorsMapping[status]} />
        {/** Buttons */}
        <div className="flex">
            {status === 'stopped' && <Button onClick={() => {
                setStatus('running')
            }} className="bg-red-500">Start</Button> }
            {status === 'running' && <Button onClick={() => {
                setStatus('stopped')
            }} className="bg-red-500">Cancel</Button> }
            {status === 'timeout' && <Button onClick={() => {
                setStatus('stopped')
            }} className="bg-red-500">Finish</Button> }
        </div>
    </div>
}
