import type { InertiaFormProps } from "@inertiajs/react"
import { CalendarIcon } from "lucide-react"
import type { UseHttpPrecognitiveProps } from "node_modules/@inertiajs/react/types/useHttp"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn, handleFormData } from "@/lib/utils"


type Props<T extends object> = Omit<React.ComponentProps<"input">, 'form'> & {
  name: string;
  label?: string;
  placeholder?: string;
  form: InertiaFormProps<T> | UseHttpPrecognitiveProps<T>
  classNames?: {
    label?: string;
    error?: string;
    wrapper?: string;
    trigger: {
      container?: string;
      button?: string;
    }
  }
}

export function DatePicker<T extends object>({ name, placeholder, label, classNames, form }: Props<T>) {
  const [open, setOpen] = React.useState(false)

  if (!form)
    throw new Error("DatePicker component requires inertia useForm hook")

  const { value, handleChange: handleFormChange, error: formError, validate, touch, invalid } = handleFormData(name, form) || {}
  const error = formError

  const handleSelect = (date: Date | undefined) => {
    handleFormChange?.(date)
    touch?.()
    validate?.()
    setOpen(false)
  }

  const date = value instanceof Date ? value : (!value || value === '' ? undefined : new Date(value))

  return (
    <Field className={cn("mx-auto w-full gap-0", classNames?.wrapper)}>
      <FieldLabel htmlFor="date" className={cn("mb-1", classNames?.label)}>{label}</FieldLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className={cn("bg-transparent justify-between font-normal rounded-lg h-auto py-2.5", classNames?.trigger?.button)}
          >
            <span>{date ? date.toLocaleDateString() : (placeholder ?? "Select date")}</span>
            <CalendarIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            defaultMonth={date}
            captionLayout="dropdown"
            onSelect={handleSelect}
          />
        </PopoverContent>
      </Popover>

      {/* Validation error display */}
      {invalid?.() && error && (
        <small className={cn("text-red-500 text-sm", classNames?.error)}>
          {error as string}
        </small>
      )}
    </Field>
  )
}
