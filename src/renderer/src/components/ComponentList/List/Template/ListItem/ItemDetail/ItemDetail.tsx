import type { AddTemplate } from '../../../../../../types'
import styles from './ItemDetail.module.css'

interface Props {
  template: AddTemplate
  setCanShowDetails(bool: boolean): void
  setModifiedTemplate(addTemplateOrNull: AddTemplate | null): void
  setIsTemplateAddable(bool: boolean): void
}

export const ItemDetail = (props: Props): React.JSX.Element => {
  const { template, setCanShowDetails, setModifiedTemplate, setIsTemplateAddable } = props

  const schdlItems = template.schdl.map((addSchdl) => {
    return (
      <li
        key={addSchdl.id}
        className={`${styles.item} ${addSchdl.color} ${addSchdl.color + '-container'}`}
      >
        <p className={styles.time}>
          <span>🕐</span>
          <span>{addSchdl.startAt}</span>
          <span>~</span>
          <span>{addSchdl.endAt}</span>
        </p>
        <p className={styles.title}>
          <span>✏️</span>
          <span>{addSchdl.title}</span>
        </p>
        <p className={styles.note}>
          <span>📝</span>
          <span className={styles.noteContent}>{addSchdl.note}</span>
        </p>
      </li>
    )
  })

  const todos = template.todo.map((todo) => {
    return (
      <li key={todo.id} className={styles.todo}>
        <span>✅</span>
        <span>{todo.title}</span>
      </li>
    )
  })

  const handleClickModify = (): void => {
    setModifiedTemplate(template)
    setCanShowDetails(false)
    setIsTemplateAddable(true)
  }

  return (
    <>
      <div className="mask" onClick={() => setCanShowDetails(false)}></div>
      <div className="form">
        <section className={styles.container}>
          <p className={styles.detailTitle}>
            <span>📋 </span>
            <span>{template.title}</span>
          </p>
          <div className={styles.content}>
            <div className={styles.schdl}>
              <ul className={`${styles.items}`}>
                {schdlItems.length === 0 ? (
                  <li className={styles.nothing}>No Schedule...</li>
                ) : (
                  schdlItems
                )}
              </ul>
            </div>
            <ul className={styles.todos}>
              {todos.length === 0 ? <li className={styles.nothing}>No To-Do...</li> : todos}
            </ul>
          </div>
          <div className={styles.btns}>
            <button className={styles.modifyBtn} onClick={handleClickModify}>
              Modify
            </button>
          </div>
        </section>
      </div>
    </>
  )
}
