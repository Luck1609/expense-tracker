import type { InertiaFormProps } from "@inertiajs/react"
import type { UseHttpPrecognitiveProps } from "node_modules/@inertiajs/react/types/useHttp"
import * as React from "react"
import { Label } from "@/components/ui/label"
import { cn, handleFormData } from "@/lib/utils"
import type { Icon, SelectOptions } from "@/types"
import { SelectContent, SelectItem, SelectTrigger, SelectValue, SelectComponent } from '../ui/select';


type Options<T extends object> = Omit<React.ComponentProps<"select">, 'form'> & {
  name: string;
  options: (SelectOptions & { className?: string })[];
  placeholder?: string;
  icon?: Icon;
  form: InertiaFormProps<T> | UseHttpPrecognitiveProps<T>
  label?: React.ReactNode;
  className?: string;
  classNames?: {
    label?: string;
    error?: string;
    wrapper?: string;
    item?: string;
  }
}

export function Select<T extends object>({
  options,
  placeholder,
  icon: SelectIcon,
  form,
  label,
  classNames,
  className,
  ...props
}: Options<T>) {

  if (!form) {
    throw new Error("Select component requires inertia useForm hook")
  }

  const { value, error: formError, handleChange, validate, touch, invalid } = handleFormData(props.name, form) || {}
  const error = formError

  const handleValueChange = (newValue: string) => {
    handleChange?.(newValue)
    touch?.()
    validate?.()
  }


  return (
    <div className={cn("w-full", classNames?.wrapper)}>
      {label && typeof (label) === 'string'
        ? <Label className={classNames?.label}>{label}</Label>
        : label
      }

      <SelectComponent
        value={value as string}
        onValueChange={handleValueChange}
      >
        <SelectTrigger className={cn(
          'w-full flex items-center py-2.5',
          SelectIcon ? 'space-x-3' : '',
          className ?? ''
        )}>
          {SelectIcon && <SelectIcon />}
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {
            options.map(({ label, value, className }, index) => (
              <SelectItem
                value={value}
                key={index.toString()}
                className={className}
              >
                {label}
              </SelectItem>
            ))
          }
        </SelectContent>
      </SelectComponent>

      {/* Validation error display */}
      {invalid?.() && error && (
        <small className={cn("text-red-500 text-sm", classNames?.error)}>
          {error as string}
        </small>
      )}
    </div>
  )
}
