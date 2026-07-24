export type Id = `${string}-${string}-${string}-${string}-${string}`

export const leftMainStates = {
  todo: 'todo',
  schedule: 'schedule',
  memo: 'memo'
} as const
export type LeftMainState = (typeof leftMainStates)[keyof typeof leftMainStates]

export interface DateData {
  year: number
  month: number
  date: number
  isToday: boolean
  isSun: boolean
  isSat: boolean
  isThisMonth: boolean
}

export interface DspTodo {
  id: Id
  date: string
  title: string
  isComplete: boolean
}

export interface DspSchdl {
  id: Id
  title: string
  note: string
  color: string
  date: string
  startAt: string
  endAt: string
  durationMin: number
  isStraddle: boolean
}

export interface Memo {
  id: Id
  date: string
  memo: string
}

export interface AddTodo {
  id: Id
  title: string
}

export interface AddSchedule {
  id: Id
  title: string
  color: string
}

export interface AddTask {
  id: Id
  title: string
  color: string
}

export interface AddTemplateTodo {
  id: Id
  title: string
}

export interface AddTemplateSchdl {
  id: Id
  title: string
  note: string
  color: string
  startAt: string
  endAt: string
  durationMin: number
}

export interface AddTemplate {
  id: Id
  title: string
  todo: AddTemplateTodo[]
  schdl: AddTemplateSchdl[]
  isTodoTemplate: boolean
  isSchdlTemplate: boolean
}

export const modeValue = {
  todo: 'todo',
  schedule: 'schedule',
  task: 'task',
  template: 'template'
} as const
type ModeValue = (typeof modeValue)[keyof typeof modeValue]
export interface AddMode {
  id: Id
  name: string
  textContent: string
  value: ModeValue
  isChecked: boolean
}

export type AddAny = AddTodo | AddSchedule | AddTask | AddTemplate

export const operatedTimeObj = {
  start: 'start',
  end: 'end'
} as const
export type OperatedTime = (typeof operatedTimeObj)[keyof typeof operatedTimeObj]

export interface ConfirmTexts {
  title: string
  sentence: string
  note: string
}
