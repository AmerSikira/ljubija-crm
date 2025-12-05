import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// Define props type
type DatePickerProps = {
  handleChange: (date: Date | undefined) => void
  selected?: Date | undefined
}

export function DatePicker({ handleChange, selected }: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const normalize = (d?: Date | null) =>
    d ? new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12) : undefined

  const [date, setDate] = React.useState<Date | undefined>(normalize(selected))

  React.useEffect(() => {
    setDate(normalize(selected))
  }, [selected])

  return (
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-full justify-between font-normal"
          >
            {date ? date.toLocaleDateString('en-GB') : "Odaberite datum"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            defaultMonth={date}
            captionLayout="dropdown"
            fromYear={1900}
            toYear={2100}
            className="w-72"
            disabled={{ before: new Date(1900, 0, 1) }}
            
            onSelect={(newDate) => {
              const normalized = normalize(newDate)
              setDate(normalized)
              handleChange(normalized) // 🔑 send back to parent
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
  )
}
