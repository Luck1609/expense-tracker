import type { InertiaFormProps } from '@inertiajs/react'
import { Plus, X } from 'lucide-react'
import type { UseHttpPrecognitiveProps } from 'node_modules/@inertiajs/react/types/useHttp'
import * as React from 'react'
import { Label } from '@/components/ui/label'
import { cn, handleFormData } from '@/lib/utils'

type TagInputProps<T extends object> = {
  name: string
  form: InertiaFormProps<T> | UseHttpPrecognitiveProps<T>
  placeholder?: string
  label?: React.ReactNode
  showPill?: boolean
  className?: string
  classNames?: {
    label?: string
    error?: string
    wrapper?: string
  }
}

export function TagInput<T extends object>({
  name,
  form,
  placeholder = 'Type tags separated by commas…',
  showPill = true,
  label,
  className,
  classNames,
}: TagInputProps<T>) {
  const [inputValue, setInputValue] = React.useState('')
  const inputRef = React.useRef<HTMLInputElement>(null)

  if (!form) throw new Error('TagInput requires an Inertia useForm instance')

  const { value, error, handleChange } = handleFormData(name, form) || {}
  const selectedValues: string[] = Array.isArray(value) ? value : value ? [value as string] : []

  const addTags = () => {
    const tokens = inputValue
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t !== '' && !selectedValues.includes(t))

    if (tokens.length === 0) return

    handleChange?.([...selectedValues, ...tokens])
    setInputValue('')
    inputRef.current?.focus()
  }

  const remove = (val: string) => {
    handleChange?.(selectedValues.filter((v) => v !== val))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTags()
    } else if (e.key === 'Backspace' && inputValue === '' && selectedValues.length > 0) {
      remove(selectedValues[selectedValues.length - 1])
    }
  }

  console.log('Pill values', selectedValues)

  return (
    <div className={cn('w-full', classNames?.wrapper)}>
      {label && (
        typeof label === 'string'
          ? <Label className={classNames?.label}>{label}</Label>
          : label
      )}

      {/* Input row */}
      <div
        className={cn(
          'relative flex items-center w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50',
          className,
        )}
      >
        <input
          ref={inputRef}
          type="text"
          className="flex-1 min-w-0 bg-transparent outline-none placeholder:text-muted-foreground"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />
        <button
          type="button"
          onClick={addTags}
          disabled={inputValue.trim() === ''}
          className="ml-2 flex items-center gap-1 rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground transition-opacity disabled:opacity-40"
        >
          <Plus className="size-3" />
          Add
        </button>
      </div>

      {/* Selected chips */}
      {selectedValues.length > 0 && showPill && (
        <div className="mt-3 flex flex-wrap gap-2">
          {selectedValues.map((val) => (
            <span
              key={val}
              className="group relative flex items-center gap-1.5 rounded-full border border-blue-100 bg-slate-50 px-4 py-1.5 text-sm text-slate-600"
            >
              {val}
              <button
                type="button"
                onClick={() => remove(val)}
                className="ml-0.5 flex size-4 items-center justify-center rounded-full bg-red-100 text-red-500 opacity-70 transition-opacity hover:opacity-100"
                aria-label={`Remove ${val}`}
              >
                <X className="size-2.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Error */}
      {form.hasErrors && error && (
        <small className={cn('mt-1 block text-sm text-red-500', classNames?.error)}>
          {error as string}
        </small>
      )}
    </div>
  )
}
