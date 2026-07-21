import './App.css'
import { Header } from './components/Header/Header'
import { Main } from './components/Main/Main'
import { ComponentList } from './components/ComponentList/ComponentList'
import { useState } from 'react'
import {
  leftMainStates,
  type LeftMainState,
  type DspSchdl,
  type DspTodo,
  type Memo
} from './types/index'
import { useLocalStorage } from './hooks'

const colors = [
  'red',
  'blue',
  'green',
  'yellow',
  'pink',
  'skyblue',
  'purple',
  'orange',
  'brown',
  'gray'
]

function App(): React.JSX.Element {
  const [trgtMon, setTrgtMon] = useState<Date>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  )
  const [trgtDate, setTrgtDate] = useState<Date>(new Date())
  const today = new Date()
  const [leftMainState, setLeftMainState] = useState<LeftMainState>(leftMainStates.schedule)
  const [isAddOpen, setIsAddOpen] = useState<boolean>(true)
  const [dspTodos, setDspTodos] = useLocalStorage<DspTodo[]>('dspTodos', [])
  const [dspSchdls, setDspSchdls] = useLocalStorage<DspSchdl[]>('dspSchdls', [])
  const [memos, setMemos] = useLocalStorage<Memo[]>('memos', [])

  return (
    <>
      <Header
        setTrgtMon={setTrgtMon}
        trgtDate={trgtDate}
        setTrgtDate={setTrgtDate}
        today={today}
        leftMainState={leftMainState}
        setLeftMainState={setLeftMainState}
        isAddOpen={isAddOpen}
        setIsAddOpen={setIsAddOpen}
      />
      <Main
        trgtMon={trgtMon}
        setTrgtMon={setTrgtMon}
        trgtDate={trgtDate}
        setTrgtDate={setTrgtDate}
        today={today}
        leftMainState={leftMainState}
        dspTodos={dspTodos}
        setDspTodos={setDspTodos}
        dspSchdls={dspSchdls}
        setDspSchdls={setDspSchdls}
        isAddOpen={isAddOpen}
        colors={colors}
        memos={memos}
        setMemos={setMemos}
      />
      {isAddOpen && <ComponentList colors={colors} />}
    </>
  )
}

export default App
