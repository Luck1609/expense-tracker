import type { InertiaFormProps } from "@inertiajs/react"
import { ChevronDown } from "lucide-react"
import type { UseHttpPrecognitiveProps } from "node_modules/@inertiajs/react/types/useHttp"
import * as React from "react"
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox"
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

  if (!form)
    throw new Error("Select component requires inertia useForm hook")

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





// MultiSelect Component using Combobox
type MultiSelectOptions<T extends object> = Omit<React.ComponentProps<"input">, 'form'> & {
  name: string;
  options: SelectOptions[];
  placeholder?: string;
  form: InertiaFormProps<T> | UseHttpPrecognitiveProps<T>
  label?: React.ReactNode;
  className?: string;
  classNames?: {
    label?: string;
    error?: string;
    wrapper?: string;
  }
}

export function MultiSelect<T extends object>({
  options,
  placeholder = "Select items...",
  form,
  label,
  classNames,
  className,
  ...props
}: MultiSelectOptions<T>) {
  const anchor = useComboboxAnchor()

  if (!form)
    throw new Error("MultiSelect component requires inertia useForm hook")

  const { value, error, handleChange } = handleFormData(props.name, form) || {}

  // Ensure value is always an array
  const selectedValues = Array.isArray(value) ? value : (value ? [value] : [])

  // Map options to items format expected by Combobox (objects with value property)
  // const items = options.map(opt => ({ value: opt.value, label: opt.label }))

  // Get label for a value
  const getLabel = (val: string) => options.find(opt => opt.value === val)?.label// || val

  return (
    <div className={cn("w-full", classNames?.wrapper)}>
      {label && typeof (label) === 'string'
        ? <Label>{label}</Label>
        : label
      }

      <Combobox
        multiple
        autoHighlight
        items={options}
        value={selectedValues}
        onValueChange={(newValues) => {
          handleChange?.(newValues)
        }}
      >
        <ComboboxChips ref={anchor} className={cn("w-full h-10", className)}>
          <div className="w-full flex items-center gap-1 overflow-x-auto">
            <ComboboxValue placeholder={placeholder}>
              {(values: string[]) => (
                <React.Fragment>
                  {values.map((val: string, index) => (
                    <React.Fragment key={`${val}-${index}`}>
                      <ComboboxChip>{getLabel(val)}</ComboboxChip>
                    </React.Fragment>
                  ))}

                  {
                    values.length === 0 && (
                      <ComboboxChipsInput placeholder={placeholder} />
                    )
                  }
                </React.Fragment>
              )}
            </ComboboxValue>

            <ChevronDown className="size-4 opacity-30 stroke-current" />
          </div>
        </ComboboxChips>
        <ComboboxContent anchor={anchor}>
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {(item: { value: string; label: string }) => (
              <ComboboxItem
                key={item.value}
                value={item.value}
              >
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>

      {form.hasErrors && error && (
        <small className={cn("text-red-500 text-sm", classNames?.error)}>
          {error as string}
        </small>
      )}
    </div>
  )
}





export function SearchableSelect<T extends object>({
  options,
  placeholder = "Select items...",
  form,
  label,
  classNames,
  className,
  ...props
}: MultiSelectOptions<T>) {

  if (!form)
    throw new Error("MultiSelect component requires inertia useForm hook")

  const { value, error, handleChange } = handleFormData(props.name, form) || {}

  // Get label for a value
  const getLabel = (val: string) => options.find(opt => opt.value === val)?.label || val

  return (
    <div className={cn("w-full", classNames?.wrapper)}>
      {label && typeof (label) === 'string'
        ? <Label>{label}</Label>
        : label
      }


      <Combobox
        autoHighlight
        items={options}
        value={value}
        onValueChange={(newValue) => {
          handleChange?.(newValue)
        }}
      >
        <ComboboxInput placeholder={placeholder} value={String(value ? getLabel(value) : '')} className={className} />
        <ComboboxContent>
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item.value} value={item.value}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>

      {form.hasErrors && error && (
        <small className={cn("text-red-500 text-sm", classNames?.error)}>
          {error as string}
        </small>
      )}
    </div>
  )
}
