import { useEffect, useState } from 'react'
import styles from './Time.module.css'
import type { OperatedTime } from '../../../../types'
import {
  calcFormDurationMinStr,
  createDisplayTimeStr,
  updateFormHour,
  updateFormMin
} from '../../../../util'

interface Props {
  startDate: Date
  setStartDate(date: Date | ((old: Date) => Date)): void
  endDate: Date
  setEndDate(date: Date | ((old: Date) => Date)): void
  durationStr: string
  setDurationStr(durStr: string | ((dateStr: string) => string)): void
}

export const Time = (props: Props): React.JSX.Element => {
  const { startDate, setStartDate, endDate, setEndDate, durationStr, setDurationStr } = props

  const [operatedTime, setOperatedTime] = useState<OperatedTime>('start')

  const underLine = {
    textDecoration: 'underline'
  }

  useEffect(() => {
    calcFormDurationMinStr(startDate, endDate, setDurationStr)
  }, [startDate, endDate, setDurationStr])

  return (
    <section className={styles.timeSec}>
      <p className="formTitle requiredAlert">Time</p>
      <section className={styles.content}>
        <section className={styles.times}>
          <p
            className={styles.startTime}
            onClick={() => setOperatedTime('start')}
            style={operatedTime === 'start' ? underLine : {}}
          >
            {createDisplayTimeStr(startDate)}
          </p>
          <p className={styles.waveLine}>~</p>
          <p
            className={styles.endTime}
            onClick={() => setOperatedTime('end')}
            style={operatedTime === 'end' ? underLine : {}}
          >
            {createDisplayTimeStr(endDate)}
          </p>
        </section>
        <section className={styles.btns}>
          {operatedTime === 'start' && (
            <section className={styles.startBtns}>
              <p>start option</p>
              <button type="button" onClick={(e) => updateFormHour(e, 5, setStartDate)}>
                +5
              </button>
              <button type="button" onClick={(e) => updateFormHour(e, -5, setStartDate)}>
                -5
              </button>
              <button type="button" onClick={(e) => updateFormHour(e, 1, setStartDate)}>
                +
              </button>
              <button type="button" onClick={(e) => updateFormHour(e, -1, setStartDate)}>
                -
              </button>
              <button
                type="button"
                onClick={(e) => updateFormMin(e, 15, setStartDate)}
                className={styles.minBtn}
              >
                ▲
              </button>
              <button
                type="button"
                onClick={(e) => updateFormMin(e, -15, setStartDate)}
                className={styles.minBtn}
              >
                ▼
              </button>
            </section>
          )}
          {operatedTime === 'end' && (
            <section className={styles.endBtns}>
              <p>end option</p>
              <button type="button" onClick={(e) => updateFormHour(e, 5, setEndDate)}>
                +5
              </button>
              <button type="button" onClick={(e) => updateFormHour(e, -5, setEndDate)}>
                -5
              </button>
              <button type="button" onClick={(e) => updateFormHour(e, 1, setEndDate)}>
                +
              </button>
              <button type="button" onClick={(e) => updateFormHour(e, -1, setEndDate)}>
                -
              </button>
              <button
                type="button"
                onClick={(e) => updateFormMin(e, 15, setEndDate)}
                className={styles.minBtn}
              >
                ▲
              </button>
              <button
                type="button"
                onClick={(e) => updateFormMin(e, -15, setEndDate)}
                className={styles.minBtn}
              >
                ▼
              </button>
            </section>
          )}
          <input
            className={styles.duration}
            type="number"
            placeholder="duration"
            value={durationStr === '0' ? '' : durationStr}
            min={0}
            max={1425}
            // onChange={ handleDurationInput }
            readOnly
          />
        </section>
      </section>
    </section>
  )
}
