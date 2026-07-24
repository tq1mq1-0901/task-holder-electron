import { useState } from 'react'
import type { Memo } from '../../../types'
import styles from './MemoArea.module.css'
import { createDateFormatStr } from '../../../util'

interface Props {
  trgtDate: Date
  memos: Memo[]
  setMemos(memos: Memo[]): void
}

export const MemoArea = ({ trgtDate, memos, setMemos }: Props): React.JSX.Element => {
  const trgtDateStr = createDateFormatStr(trgtDate)

  const [memo, setMemo] = useState(memos.find((el) => el.date === trgtDateStr)?.memo ?? '')
  const [canSave, setCanSave] = useState(false)

  const prevMemo = memos.find((el) => el.date === trgtDateStr)?.memo ?? ''
  const title = `${trgtDate.getMonth() + 1}/${trgtDate.getDate()}'s MEMO`

  const handleInputMemo = (e: React.InputEvent<HTMLTextAreaElement>): void => {
    const inputValue = e.currentTarget.value
    inputValue.trim() === prevMemo.trim() ? setCanSave(false) : setCanSave(true)
    setMemo(inputValue)
  }

  const handleClickSave = (): void => {
    setCanSave(false)

    let newMemoId
    const newMemos = memos.filter((el) => {
      if (el.date === trgtDateStr) newMemoId = el.id
      return el.date !== trgtDateStr && el.memo.trim() !== ''
    })

    if (memo.trim() !== '') {
      newMemos.push({
        id: newMemoId ?? crypto.randomUUID(),
        date: trgtDateStr,
        memo: memo
      })
    }
    setMemos(newMemos)
  }

  return (
    <section className={styles.container}>
      <section className={styles.header}>
        <p className={styles.title}>{title}</p>
      </section>
      <section className={styles.memoContainer}>
        <textarea
          className={styles.memo}
          name="dailyMemo"
          maxLength={500}
          value={memo}
          onInput={handleInputMemo}
        ></textarea>
      </section>
      <section className={styles.btns}>
        <button disabled={!canSave} className={styles.saveBtn} onClick={handleClickSave}>
          Save
        </button>
      </section>
    </section>
  )
}
