import styles from './Form.module.css'
import {
  modeValue,
  type AddSchedule,
  type AddMode,
  type AddTask,
  type AddTemplate,
  type AddTemplateSchdl,
  type AddTemplateTodo,
  type AddTodo,
  ConfirmTexts
} from '../../../../../types'
import { useState, useRef } from 'react'
import { Schedule } from './FormParts/Schedule/Schedule'
import { Title } from './FormParts/Title/Title'
import { Todo } from './FormParts/Todo/Todo'
import { AddList } from './FormParts/AddList/AddList'

interface Props {
  setIsTemplateAddable(bool: boolean): void
  addTodos: AddTodo[]
  addSchedules: AddSchedule[]
  addTasks: AddTask[]
  addTemplates: AddTemplate[]
  setAddTemplates(addTemplates: AddTemplate[]): void
  modifiedTemplate: AddTemplate | null
  setModifiedTemplate(addTemplateOrNull: AddTemplate | null): void
  confirm(texts: ConfirmTexts): Promise<boolean>
}

export const Form = (props: Props): React.JSX.Element => {
  const {
    setIsTemplateAddable,
    addTodos,
    addSchedules,
    addTasks,
    addTemplates,
    setAddTemplates,
    modifiedTemplate,
    setModifiedTemplate,
    confirm
  } = props

  const [titleValue, setTitleValue] = useState(modifiedTemplate ? modifiedTemplate.title : '')
  const [titleError, setTitleError] = useState(false)
  const [contentError, setContentError] = useState(false)
  const [durationError, setDurationError] = useState(false)
  const [timeConflictError, setTimeConflictError] = useState(false)
  const [todosLimitError, setTodosLimitError] = useState(false)
  const [timeStraddleError, setTimeStraddleError] = useState(false)
  const [modes, setModes] = useState<AddMode[]>(() => {
    const nameAttr = 'add-template-mode-btn'
    return [
      {
        id: crypto.randomUUID(),
        name: nameAttr,
        textContent: 'To-Do',
        value: modeValue.todo,
        isChecked: true
      },
      {
        id: crypto.randomUUID(),
        name: nameAttr,
        textContent: 'Schedule',
        value: modeValue.schedule,
        isChecked: false
      },
      {
        id: crypto.randomUUID(),
        name: nameAttr,
        textContent: 'Task',
        value: modeValue.task,
        isChecked: false
      },
      {
        id: crypto.randomUUID(),
        name: nameAttr,
        textContent: 'Template',
        value: modeValue.template,
        isChecked: false
      }
    ]
  })

  const [noteValue, setNoteValue] = useState('')
  const [startDate, setStartDate] = useState(new Date(Date.UTC(2004, 8, 1, 0, 0, 0, 0)))
  const [endDate, setEndDate] = useState(new Date(Date.UTC(2004, 8, 1, 0, 0, 0, 0)))
  const [durationStr, setDurationStr] = useState('')
  const [addTemplateTodos, setAddTemplateTodos] = useState<AddTemplateTodo[]>(() =>
    modifiedTemplate ? modifiedTemplate.todo : []
  )
  const [addTemplateSchdls, setAddTemplateSchdls] = useState<AddTemplateSchdl[]>(() =>
    modifiedTemplate ? modifiedTemplate.schdl : []
  )
  const inputRef = useRef<HTMLInputElement>(null)

  const resetAllErrorMessage = (): void => {
    setTitleError(false)
    setContentError(false)
    setDurationError(false)
    setTimeConflictError(false)
    setTodosLimitError(false)
    setTimeStraddleError(false)
  }

  const handleClickMask = (): void => {
    setIsTemplateAddable(false)
    setModifiedTemplate(null)
  }

  const resetInput = (): void => {
    setTitleValue('')
    inputRef.current!.focus()
  }
  const handleSubmitButton = (e: React.SubmitEvent<HTMLFormElement>): void => {
    e.preventDefault()

    const newTemplate = {
      id: modifiedTemplate ? modifiedTemplate.id : crypto.randomUUID(),
      title: titleValue,
      todo: addTemplateTodos,
      schdl: addTemplateSchdls,
      isTodoTemplate: addTemplateSchdls.length === 0 ? true : false,
      isSchdlTemplate: addTemplateTodos.length === 0 ? true : false
    }
    const contentHasError = newTemplate.isSchdlTemplate && newTemplate.isTodoTemplate
    const titleHasError = titleValue.trim() === ''
    setContentError(contentHasError)
    setTitleError(titleHasError)
    if (titleHasError || contentHasError) return

    const newAddTemplates = modifiedTemplate
      ? addTemplates.map((template) => (template.id === newTemplate.id ? newTemplate : template))
      : [...addTemplates, newTemplate]

    setAddTemplates(newAddTemplates)
    setIsTemplateAddable(false)
    setModifiedTemplate(null)
    resetInput()
  }

  return (
    <section className={styles.container}>
      <div className="mask" onClick={handleClickMask}></div>
      <form className={`form ${styles.layout}`} onSubmit={handleSubmitButton}>
        <section className={styles.inputs}>
          <Title inputValue={titleValue} setInputValue={setTitleValue} inputRef={inputRef} />
          <section className={styles.mainArea}>
            <p>Template</p>
            <section className={styles.contents}>
              <Schedule
                addTemplateTodos={addTemplateTodos}
                setAddTemplateTodos={setAddTemplateTodos}
                addTemplateSchdls={addTemplateSchdls}
                setAddTemplateSchdls={setAddTemplateSchdls}
                noteValue={noteValue}
                startDate={startDate}
                endDate={endDate}
                durationStr={durationStr}
                setDurationError={setDurationError}
                setTimeConflictError={setTimeConflictError}
                setTimeStraddleError={setTimeStraddleError}
                resetAllErrorMessage={resetAllErrorMessage}
                setTodosLimitError={setTodosLimitError}
                confirm={confirm}
              />
              <Todo
                addTemplateTodos={addTemplateTodos}
                setAddTemplateTodos={setAddTemplateTodos}
                addTemplateSchdls={addTemplateSchdls}
                setAddTemplateSchdls={setAddTemplateSchdls}
                noteValue={noteValue}
                startDate={startDate}
                endDate={endDate}
                durationStr={durationStr}
                setDurationError={setDurationError}
                setTimeConflictError={setTimeConflictError}
                setTodosLimitError={setTodosLimitError}
                setTimeStraddleError={setTimeStraddleError}
                resetAllErrorMessage={resetAllErrorMessage}
                confirm={confirm}
              />
              <AddList
                modes={modes}
                setModes={setModes}
                addTodos={addTodos}
                addSchedules={addSchedules}
                addTasks={addTasks}
                addTemplates={addTemplates}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                durationStr={durationStr}
                setDurationStr={setDurationStr}
                noteValue={noteValue}
                setNoteValue={setNoteValue}
              />
            </section>
          </section>
        </section>
        <section className={styles.options}>
          <div className={styles.errors}>
            {titleError && <p className="error">Input a valid title.</p>}
            {contentError && <p className="error">Add Schedule or To-Do.</p>}
            {durationError && <p className="error">Set a valid duration.</p>}
            {timeConflictError && (
              <p className="error">New Schedule time is in conflict with others.</p>
            )}
            {todosLimitError && <p className="error">Limit of 10 items reached.</p>}
            {timeStraddleError && (
              <p className="error">Cannot add a schedule that spans other days.</p>
            )}
          </div>
          <button className={styles.addBtn}>Add</button>
        </section>
      </form>
    </section>
  )
}
