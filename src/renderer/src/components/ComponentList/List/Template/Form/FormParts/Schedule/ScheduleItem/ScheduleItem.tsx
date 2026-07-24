import type { AddTemplateSchdl, ConfirmTexts } from '../../../../../../../../types'
import styles from './ScheduleItem.module.css'

interface Props {
  schdl: AddTemplateSchdl
  addTemplateSchdls: AddTemplateSchdl[]
  setAddTemplateSchdls(schdls: AddTemplateSchdl[]): void
  confirm(texts: ConfirmTexts): Promise<boolean>
}

export const ScheduleItem = (props: Props): React.JSX.Element => {
  const { schdl, addTemplateSchdls, setAddTemplateSchdls, confirm } = props

  const handleDelSchdl = async (): Promise<void> => {
    if (
      !(await confirm({
        title: '削除',
        sentence: `「${schdl.title}」を削除しますか？`,
        note: ''
      }))
    )
      return

    const newAddTemplateSchdls = addTemplateSchdls.filter((el) => el.id !== schdl.id)
    setAddTemplateSchdls(newAddTemplateSchdls)
  }

  return (
    <li
      key={schdl.id}
      className={`${styles.item} ${schdl.color} ${schdl.color + '-container'}`}
      onClick={handleDelSchdl}
    >
      <p className={styles.time}>
        <span>🕐</span>
        <span>{schdl.startAt}</span>
        <span>~</span>
        <span>{schdl.endAt}</span>
      </p>
      <p className={styles.title}>
        <span>✏️</span>
        <span>{schdl.title}</span>
      </p>
      <p className={styles.note}>
        <span>📝</span>
        <span className={styles.noteContent}>{schdl.note}</span>
      </p>
    </li>
  )
}
