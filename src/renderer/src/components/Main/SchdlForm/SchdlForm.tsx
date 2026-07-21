import type { AddSchedule, AddTask, DspSchdl } from '../../../types'
import {
  checkTimeConflict,
  createDateFormatStr,
  createDisplaySchedules,
  createDisplayTimeStr
} from '../../../util'
import styles from './SchdlForm.module.css'
import { Text } from './FormParts/Text'
import { Color } from './FormParts/Color'
import { Time } from './FormParts/Time'
import { useState } from 'react'

interface Props {
  trgtDate: Date
  setIsSchdlAddable(bool: boolean): void
  dropedData: AddSchedule | AddTask | null
  colors: string[]
  dspSchdls: DspSchdl[]
  setDspSchdls(schdls: DspSchdl[]): void
}

export const SchdlForm = (props: Props): React.JSX.Element => {
  const { trgtDate, setIsSchdlAddable, dropedData, colors, dspSchdls, setDspSchdls } = props

  const [title, setTitle] = useState<string>(dropedData!.title)
  const [note, setNote] = useState<string>('')
  const [color, setColor] = useState(dropedData!.color)
  const [startDate, setStartDate] = useState(new Date(Date.UTC(2004, 8, 1, 0, 0, 0, 0)))
  const [endDate, setEndDate] = useState(new Date(Date.UTC(2004, 8, 1, 0, 0, 0, 0)))
  const [durationStr, setDurationStr] = useState<string>('')
  const [titleError, setTitleError] = useState(false)
  const [durationError, setDurationError] = useState(false)
  const [timeError, setTimeError] = useState(false)

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>): void => {
    e.preventDefault()

    const durationMin = Number(durationStr)
    const titleHasError = !title.trim()
    const durationHasError = !durationMin

    setTitleError(titleHasError)
    setDurationError(durationHasError)

    if (titleHasError || durationHasError) return

    const newSchdl = {
      id: crypto.randomUUID(),
      title: title,
      note: note,
      color: color,
      date: createDateFormatStr(trgtDate),
      startAt: createDisplayTimeStr(startDate),
      endAt: createDisplayTimeStr(endDate),
      durationMin: durationMin,
      isStraddle: false
    }

    const trgtSchdls = createDisplaySchedules(dspSchdls, trgtDate)
    const nextDateSchdls = createDisplaySchedules(
      dspSchdls,
      new Date(trgtDate.getFullYear(), trgtDate.getMonth(), trgtDate.getDate() + 1)
    )
    const timeHasError = checkTimeConflict(newSchdl, trgtSchdls, nextDateSchdls)
    if (timeHasError) {
      setTimeError(timeHasError)
      return
    }

    // 条件ここまで

    const newSchdls = [...dspSchdls, newSchdl]
    setDspSchdls(newSchdls)
    setIsSchdlAddable(false)
  }

  return (
    <section>
      <div className="mask" onClick={() => setIsSchdlAddable(false)}></div>
      <form className={`form ${styles.layout}`} onSubmit={handleSubmit}>
        <p className={styles.date}>{`📅 ${createDateFormatStr(trgtDate)}`}</p>
        <section className={styles.inputs}>
          <div>
            <Text text={title} textSetter={setTitle} isRequired={true} isText={true}>
              Title
            </Text>
          </div>
          <div>
            <Text text={note} textSetter={setNote} isRequired={false} isText={false}>
              Note
            </Text>
          </div>
          <div>
            <Color trgtColor={color} setTrgtColor={setColor} colors={colors} />
          </div>
          <div>
            <Time
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              durationStr={durationStr}
              setDurationStr={setDurationStr}
            />
          </div>
        </section>
        <section className={styles.option}>
          <div className={styles.errors}>
            {durationError && <p className="error">Set a valid duration.</p>}
            {titleError && <p className="error">Set a valid Title.</p>}
            {timeError && <p className="error">New Schedule time is in conflict with others.</p>}
          </div>
          <div className={styles.btns}>
            <button className={styles.addBtn}>Add</button>
          </div>
        </section>
      </form>
    </section>
  )
}
