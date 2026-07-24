import './App.css'
import { Header } from './components/Header/Header'
import { Main } from './components/Main/Main'
import { ComponentList } from './components/ComponentList/ComponentList'
import { useRef, useState } from 'react'
import {
  leftMainStates,
  type LeftMainState,
  type DspSchdl,
  type DspTodo,
  type Memo,
  ConfirmTexts
} from './types/index'
import { useLocalStorage } from './hooks'
import { Confirm } from './components/common/Confirm/Confirm'

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
  const [confirmState, setConfirmState] = useState<{
    isDisplayed: boolean
    texts: ConfirmTexts
  } | null>(null)

  // resolveの引数に値を入れないようにresolveRef.currentの中にresolve関数を幽閉(引数を入れないことにより、結果的にconfirmが止まる。)
  const resolveRef = useRef<((response: boolean) => void) | null>(null)

  function confirm(texts: ConfirmTexts): Promise<boolean> {
    setConfirmState({
      isDisplayed: true,
      texts
    })
    // resolveに引数が入るまで、このreturnでストップする。
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve
    })
  }

  // resolveRef.currentにresolveがあるので、そこに引数を入れてconfirmをリスタートさせ、confirmを閉じる。
  const handleConfirmResponse = (response: boolean): void => {
    resolveRef.current?.(response)
    setConfirmState(null)
  }

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
      {confirmState?.isDisplayed && (
        <Confirm
          title={confirmState?.texts.title ?? ''}
          sentence={confirmState?.texts.sentence ?? ''}
          note={confirmState?.texts.note ?? ''}
          onOk={() => handleConfirmResponse(true)}
          onCancel={() => handleConfirmResponse(false)}
        />
      )}
    </>
  )
}

export default App
