import * as React from "react"
import { Input } from "@/components/ui/input"

// Define props type
type DatePickerProps = {
  handleChange: (date: Date | undefined) => void
  selected?: Date | undefined
}

export function DatePicker({ handleChange, selected }: DatePickerProps) {
  const normalize = (d?: Date | null) =>
    d ? new Date(d.getFullYear(), d.getMonth(), d.getDate()) : undefined

  const formatValue = (d?: Date) => {
    if (!d) return ""
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const parseValue = (value: string) => {
    if (!value) return undefined
    const [year, month, day] = value.split("-").map(Number)
    if (!year || !month || !day) return undefined
    return new Date(year, month - 1, day)
  }

  const [date, setDate] = React.useState<Date | undefined>(normalize(selected))

  React.useEffect(() => {
    setDate(normalize(selected))
  }, [selected])

  return (
    <Input
      id="date"
      type="date"
      value={formatValue(date)}
      onChange={(event) => {
        const next = parseValue(event.target.value)
        setDate(next)
        handleChange(next)
      }}
    />
  )
}
