import { useState } from 'react'
import type { AddSchedule, AddTask, AddTemplate, AddTodo } from '../../../../types'
import styles from './Template.module.css'
import { Form } from './Form/Form'
import { ListItem } from './ListItem/ListItem'
import { TrushCan } from '../TrushCan/TrushCan'

interface Props {
  addTemplates: AddTemplate[]
  setAddTemplates(addTemplates: AddTemplate[]): void
  colors: string[]
  addTodos: AddTodo[]
  addSchedules: AddSchedule[]
  addTasks: AddTask[]
}

export const Template = (props: Props): React.JSX.Element => {
  const { addTemplates, setAddTemplates, addTodos, addSchedules, addTasks } = props

  const MIMEType = 'add/template'

  const [isTemplateAddable, setIsTemplateAddable] = useState(false)
  const [modifiedTemplate, setModifiedTemplate] = useState<AddTemplate | null>(null)

  const templateItems = addTemplates.map((template) => (
    <ListItem
      key={template.id}
      MIMEType={MIMEType}
      template={template}
      setModifiedTemplate={setModifiedTemplate}
      setIsTemplateAddable={setIsTemplateAddable}
    />
  ))

  return (
    <section className={styles.container}>
      <section className={styles.templateSec}>
        <section className={styles.head}>
          <p className={styles.headTitle}>
            <span className={styles.symbol}>📋</span>
            <span className={styles.title}>Template</span>
          </p>
          <button className={styles.formBtn} onClick={() => setIsTemplateAddable(true)}>
            +
          </button>
          {isTemplateAddable && (
            <Form
              key={modifiedTemplate ? modifiedTemplate.id : 'new'}
              setIsTemplateAddable={setIsTemplateAddable}
              addTodos={addTodos}
              addSchedules={addSchedules}
              addTasks={addTasks}
              addTemplates={addTemplates}
              setAddTemplates={setAddTemplates}
              modifiedTemplate={modifiedTemplate}
              setModifiedTemplate={setModifiedTemplate}
            />
          )}
        </section>
        <ul className={styles.templates}>{templateItems}</ul>
      </section>
      <TrushCan MIMEType={MIMEType} lists={addTemplates} setter={setAddTemplates} />
    </section>
  )
}
