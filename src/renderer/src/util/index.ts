import type React from 'react'
import type { AddTemplateSchdl, DateData, DspSchdl } from '../types'

export const timeArr = Array.from({ length: 24 }, (_, i) => `${i}:00`)

export function createPrevMonthDates(dateObj: Date): DateData[] {
  const dateDataArr: DateData[] = []
  const FirstDay = new Date(dateObj.getFullYear(), dateObj.getMonth(), 1).getDay()
  const eotmDate = new Date(dateObj.getFullYear(), dateObj.getMonth(), 0).getDate()
  const todayTime0 = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate()
  ).getTime()
  for (let i = 0; i < FirstDay; i++) {
    const year = dateObj.getMonth() === 0 ? dateObj.getFullYear() - 1 : dateObj.getFullYear()
    const month = dateObj.getMonth() === 0 ? 11 : dateObj.getMonth() - 1
    const d = new Date(year, month, eotmDate - i)
    dateDataArr.unshift({
      year: year,
      month: month,
      date: eotmDate - i,
      isToday: d.getTime() === todayTime0,
      isSun: d.getDay() === 0,
      isSat: d.getDay() === 6,
      isThisMonth: false
    })
  }
  return dateDataArr
}

export function createThisMonthDates(dateObj: Date): DateData[] {
  const dateDataArr: DateData[] = []
  const eotmDate = new Date(dateObj.getFullYear(), dateObj.getMonth() + 1, 0).getDate()
  const todayTime0 = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate()
  ).getTime()
  for (let i = 1; i <= eotmDate; i++) {
    const year = dateObj.getFullYear()
    const month = dateObj.getMonth()
    const d = new Date(year, month, i)
    dateDataArr.push({
      year: year,
      month: month,
      date: i,
      isToday: d.getTime() === todayTime0,
      isSun: d.getDay() === 0,
      isSat: d.getDay() === 6,
      isThisMonth: true
    })
  }
  return dateDataArr
}

export function createNextMonthDates(dateObj: Date): DateData[] {
  const dateDataArr: DateData[] = []
  const eotmDay = new Date(dateObj.getFullYear(), dateObj.getMonth() + 1, 0).getDay()
  const todayTime0 = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate()
  ).getTime()
  for (let i = 1; i <= 6 - eotmDay; i++) {
    const year = dateObj.getMonth() === 11 ? dateObj.getFullYear() + 1 : dateObj.getFullYear()
    const month = dateObj.getMonth() === 11 ? 0 : dateObj.getMonth() + 1
    const d = new Date(year, month, i)
    dateDataArr.push({
      year: year,
      month: month,
      date: i,
      isToday: d.getTime() === todayTime0,
      isSun: d.getDay() === 0,
      isSat: d.getDay() === 6,
      isThisMonth: false
    })
  }
  return dateDataArr
}

export function createDateFormatStr(year: number, month: number, date: number): string
export function createDateFormatStr(dateObj: Date, num?: number): string
export function createDateFormatStr(
  dateObjOrYear: number | Date,
  monthOrNum?: number,
  dateArg?: number
): string {
  let year
  let month
  let date

  if (dateObjOrYear instanceof Date) {
    let fixedDateObj = dateObjOrYear
    if (monthOrNum)
      fixedDateObj = new Date(
        dateObjOrYear.getFullYear(),
        dateObjOrYear.getMonth(),
        dateObjOrYear.getDate() + monthOrNum
      )

    year = fixedDateObj.getFullYear()
    month = String(fixedDateObj.getMonth() + 1).padStart(2, '0')
    date = String(fixedDateObj.getDate()).padStart(2, '0')
  } else if (typeof dateObjOrYear === 'number') {
    year = dateObjOrYear
    month = String(monthOrNum! + 1).padStart(2, '0')
    date = String(dateArg).padStart(2, '0')
  }

  const dateFormatString = [year, month, date].join('-')

  return dateFormatString
}

export function calcSchedulePositionTop(startAt: string): string {
  const [hour, min] = startAt.split(':').map(Number)
  const halfHourCount = hour * 2 + min / 30
  /* 8pxはpaddingを考慮したため。 */
  return `calc(25px * ${halfHourCount} + 8px)`
}

function calcRemainingMinOfDate(startAt: string): number {
  const [hour, min] = startAt.split(':').map(Number)
  const minOfStartAt = hour * 60 + min
  return 24 * 60 - minOfStartAt
}

export function calcScheduleHeight(startAt: string, durationMin: number): string {
  const remainingMinutes = calcRemainingMinOfDate(startAt)
  if (remainingMinutes < durationMin) {
    return `calc(25px * ${remainingMinutes / 30})`
  } else {
    return `calc(25px * ${durationMin / 30})`
  }
}

export function createDisplaySchedules(schedules: DspSchdl[], trgtDate: Date): DspSchdl[] {
  const prcDate = new Date(trgtDate.getFullYear(), trgtDate.getMonth(), trgtDate.getDate() - 1)
  const prcDateSchdls = schedules.filter((schdl) => schdl.date === createDateFormatStr(prcDate))
  const carryOverSchdl = prcDateSchdls.find(
    (schdl) => schdl.durationMin > calcRemainingMinOfDate(schdl.startAt)
  )
  const trgtDateSchdls = schedules.filter((schdl) => schdl.date === createDateFormatStr(trgtDate))

  if (!carryOverSchdl) return trgtDateSchdls
  return [
    ...trgtDateSchdls,
    {
      ...carryOverSchdl,
      startAt: '0:00',
      durationMin: carryOverSchdl.durationMin - calcRemainingMinOfDate(carryOverSchdl.startAt),
      isStraddle: true
    }
  ]
}

export function createDisplayTimeStr(date: Date): string {
  return `${date.getUTCHours()}:${String(date.getUTCMinutes()).padStart(2, '0')}`
}

export function createDataTimeStr(date: Date): string {
  return `${String(date.getUTCHours()).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')}`
}

export function updateFormHour(
  e: React.MouseEvent<HTMLElement>,
  hour: number,
  setter: React.Dispatch<React.SetStateAction<Date>>
): void {
  const oneMin = 1000 * 60
  const oneHour = oneMin * 60

  e.preventDefault()
  setter((old) => new Date(old.getTime() + oneHour * hour))
}

export function updateFormMin(
  e: React.MouseEvent<HTMLElement>,
  min: number,
  setter: React.Dispatch<React.SetStateAction<Date>>
): void {
  const oneMin = 1000 * 60

  e.preventDefault()
  setter((old) => new Date(old.getTime() + oneMin * min))
}

export function calcFormDurationMinStr(
  startDate: Date,
  endDate: Date,
  setter: React.Dispatch<React.SetStateAction<string>>
): void {
  const startMinFromHour = startDate.getUTCHours() * 60
  const endMinFromHour = endDate.getUTCHours() * 60

  const totalStartMin = startMinFromHour + startDate.getUTCMinutes()
  const totalEndMin = endMinFromHour + endDate.getUTCMinutes()

  const nextDateTotalEndMin = totalEndMin + 60 * 24

  totalStartMin > totalEndMin
    ? setter(String(nextDateTotalEndMin - totalStartMin))
    : setter(String(totalEndMin - totalStartMin))
}

export function convertTimeStrIntoDurationMin(dateStr: string): number {
  const timeStrArr = dateStr.split(':')
  const hour = Number(timeStrArr[0])
  const min = Number(timeStrArr[1])

  return hour * 60 + min
}

export function checkTimeConflict(
  newSchdl: DspSchdl | AddTemplateSchdl,
  trgtDateSchdls: DspSchdl[] | AddTemplateSchdl[],
  nextDateSchdls: DspSchdl[] | AddTemplateSchdl[]
): boolean {
  const newStart = convertTimeStrIntoDurationMin(newSchdl.startAt)
  let newEnd = convertTimeStrIntoDurationMin(newSchdl.endAt)

  let isConflict = false

  const createShapedStraddlingSchdl = (
    schdl: DspSchdl | AddTemplateSchdl
  ): DspSchdl | AddTemplateSchdl => {
    const startAtNumArr = schdl.startAt.split(':').map((el) => Number(el))
    const endAtNumArr = schdl.endAt.split(':').map((el) => Number(el))
    return {
      ...schdl,
      startAt: `${startAtNumArr[0] + 24}:${String(startAtNumArr[1]).padStart(2, '0')}`,
      endAt: `${endAtNumArr[0] + 24}:${String(endAtNumArr[1]).padStart(2, '0')}`
    }
  }

  const checkConflict = (schdl: DspSchdl | AddTemplateSchdl): void => {
    const dspStart = convertTimeStrIntoDurationMin(schdl.startAt)
    let dspEnd = convertTimeStrIntoDurationMin(schdl.endAt)

    const conflictChecker = (): void => {
      const isNewStartConflict = dspStart <= newStart && newStart < dspEnd
      const isNewEndConflict = dspStart < newEnd && newEnd <= dspEnd

      if (isNewStartConflict || isNewEndConflict) {
        isConflict = true
      } else if (dspStart > newStart && dspEnd < newEnd) {
        isConflict = true
      }
    }

    if (dspStart < dspEnd) {
      conflictChecker()
    }
    if (dspStart > dspEnd) {
      dspEnd += 60 * 24
      conflictChecker()
    }
  }

  if (newStart < newEnd) {
    trgtDateSchdls.forEach((schdl) => checkConflict(schdl))
  }
  if (newStart > newEnd) {
    newEnd = convertTimeStrIntoDurationMin(newSchdl.endAt) + 24 * 60

    trgtDateSchdls.forEach((schdl) => checkConflict(schdl))
    const shapedNextDateSchdls = nextDateSchdls.map((schdl) => createShapedStraddlingSchdl(schdl))
    shapedNextDateSchdls.forEach((schdl) => checkConflict(schdl))
  }

  return isConflict
}
