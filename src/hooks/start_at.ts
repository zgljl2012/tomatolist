import { atom, useRecoilState } from "recoil";

const tomatoStatAt = atom<number>({
  default: 0,
  key: 'tomato-start_at'
})

export function useTomatoStart() {
  const [startAt, setStartAt] = useRecoilState(tomatoStatAt)
  function tomatoStart() {
    setStartAt(new Date().getTime() / 1000)
  }
  function tomatoClear() {
    setStartAt(0)
  }
  return {
    startAt,
    tomatoStart,
    tomatoClear
  }
}
