import type { AddSchedule } from '../../../../../types'
import styles from './Form.module.css'
import { useState, useRef } from 'react'

interface Props {
  addSchedules: AddSchedule[]
  setAddSchedules(addSchedules: AddSchedule[]): void
  colors: string[]
}

export const Form = ({ addSchedules, setAddSchedules, colors }: Props): React.JSX.Element => {
  const [inputValue, setInputValue] = useState<string>('')
  const [checkedColor, setCheckedColor] = useState<string>('red')
  const [colorSelectable, setColorSelectable] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const resetInput = (): void => {
    setInputValue('')
    inputRef.current!.focus()
  }
  const handleSubmitButton = (e: React.SubmitEvent<HTMLFormElement>): void => {
    e.preventDefault()
    if (inputValue.trim() === '') {
      resetInput()
      return
    }
    setAddSchedules([
      ...addSchedules,
      { id: crypto.randomUUID(), title: inputValue, color: checkedColor }
    ])
    resetInput()
  }

  const colorLis = colors.map((color) => (
    <li key={color} className={styles.colorContainer} onClick={() => setCheckedColor(color)}>
      <div className={`${color} ${styles.colorCircle}`}></div>
    </li>
  ))

  return (
    <form className={styles.form} onSubmit={handleSubmitButton}>
      <input
        type="text"
        className={styles.titleInp}
        name="todoTitle"
        value={inputValue}
        onChange={(e) => setInputValue(e.currentTarget.value)}
        ref={inputRef}
        maxLength={15}
      />
      <div>
        <div className={styles.colorIcon} onClick={() => setColorSelectable((old) => !old)}>
          <div className={`${checkedColor} ${styles.colorCircle}`}></div>
        </div>
        {colorSelectable && (
          <>
            <div className={styles.clearMask} onClick={() => setColorSelectable(false)}></div>
            <ul className={styles.colors}>{colorLis}</ul>
          </>
        )}
      </div>
      <button className={styles.addBtn}>Add</button>
    </form>
  )
}
