import { useEffect } from "react";
import { atom, useRecoilState } from "recoil";
import { TomatoPerDay, loadTomatos } from "../services/tomato";

const tomatosState = atom<TomatoPerDay[]>({
  default: [],
  key: "tomatos_state",
})

export function useTomatos() {
  const [tomatos, setTomatos] = useRecoilState(tomatosState);
  function reload() {
    loadTomatos()
      .then((values) => {
        setTomatos(values);
      })
      .catch((err) => {
        console.error(err);
      });
  }
  useEffect(() => {
    reload()
  }, []);
  return {
    tomatos, reload
  }
}
