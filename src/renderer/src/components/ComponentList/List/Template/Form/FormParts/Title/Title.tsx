import type { Ref } from 'react'
import styles from './Title.module.css'

interface Props {
  inputValue: string
  setInputValue(value: string): void
  inputRef: Ref<HTMLInputElement>
}

export const Title = ({ inputValue, setInputValue, inputRef }: Props): React.JSX.Element => {
  return (
    <label className={styles.titleArea}>
      <span>Title</span>
      <input
        type="text"
        name="NewAddTemplateTitle"
        value={inputValue}
        onInput={(e) => setInputValue(e.currentTarget.value)}
        ref={inputRef}
        spellCheck={false}
      />
    </label>
  )
}
