import type { InertiaFormProps } from '@inertiajs/react'
import { ChevronDown, Loader2, X } from 'lucide-react'
import type { UseHttpPrecognitiveProps } from 'node_modules/@inertiajs/react/types/useHttp'
import * as React from 'react'
import { Label } from '@/components/ui/label'
import { cn, handleFormData } from '@/lib/utils'
import type { SelectOptions } from '@/types'

type SkillPickerProps<T extends object> = {
  name: string
  form: InertiaFormProps<T> | UseHttpPrecognitiveProps<T>
  options: SelectOptions[]
  onSearch?: (query: string) => Promise<SelectOptions[]>
  placeholder?: string
  label?: React.ReactNode
  className?: string
  classNames?: {
    label?: string
    error?: string
    wrapper?: string
  }
}

export function SkillPicker<T extends object>({
  name,
  form,
  options,
  onSearch,
  placeholder = 'Search skills...',
  label,
  className,
  classNames,
}: SkillPickerProps<T>) {
  const [query, setQuery] = React.useState('')
  const [open, setOpen] = React.useState(false)
  const [asyncOptions, setAsyncOptions] = React.useState<SelectOptions[]>([])
  const [loading, setLoading] = React.useState(false)
  const [highlighted, setHighlighted] = React.useState<number>(-1)

  const containerRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  if (!form) throw new Error('SkillPicker requires an Inertia useForm instance')

  const { value, error, handleChange } = handleFormData(name, form) || {}
  const selectedValues: string[] = Array.isArray(value) ? value : value ? [value as string] : []

  // Merge passed options with any async results
  const allOptions = React.useMemo(() => {
    const merged = [...options]
    asyncOptions.forEach((opt) => {
      if (!merged.find((o) => o.value === opt.value)) merged.push(opt)
    })
    return merged
  }, [options, asyncOptions])


  
  const getLabel = (val: string) =>
    allOptions.find((o) => o.value === val)?.label ?? val

  // Filter options: match query, exclude already-selected
  const filteredOptions = React.useMemo(() => {
    const q = query.toLowerCase()
    return allOptions.filter(
      (opt) =>
        !selectedValues.includes(opt.value) &&
        (q === '' || String(opt.label).toLowerCase().includes(q)),
    )
  }, [allOptions, selectedValues, query])

  // Reset highlight when list changes
  React.useEffect(() => {
    setHighlighted(-1)
  }, [filteredOptions.length])

  // Debounced async search
  React.useEffect(() => {
    if (!onSearch) return
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      if (!query) { setAsyncOptions([]); return }
      setLoading(true)
      try {
        const results = await onSearch(query)
        setAsyncOptions(results)
      } finally {
        setLoading(false)
      }
    }, 300)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query, onSearch])

  // Close on outside click
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const select = (val: string) => {
    handleChange?.([...selectedValues, val])
    setQuery('')
    setOpen(true)
    inputRef.current?.focus()
  }

  const remove = (val: string) => {
    handleChange?.(selectedValues.filter((v) => v !== val))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setOpen(false)
      return
    }
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') setOpen(true)
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlighted((h) => Math.min(h + 1, filteredOptions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlighted((h) => Math.max(h - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (highlighted >= 0 && filteredOptions[highlighted]) {
        select(filteredOptions[highlighted].value)
      }
    } else if (e.key === 'Backspace' && query === '' && selectedValues.length > 0) {
      remove(selectedValues[selectedValues.length - 1])
    }
  }

  return (
    <div className={cn('w-full', classNames?.wrapper)} ref={containerRef}>
      {label && (
        typeof label === 'string'
          ? <Label className={classNames?.label}>{label}</Label>
          : label
      )}

      {/* Input */}
      <div
        className={cn(
          'relative flex items-center w-full rounded-md border border-input bg-transparent px-3 py-2.5 text-sm shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50',
          className,
        )}
        onClick={() => { setOpen(true); inputRef.current?.focus() }}
      >
        <input
          ref={inputRef}
          type="text"
          className="flex-1 min-w-0 bg-transparent outline-none placeholder:text-muted-foreground"
          placeholder={placeholder}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />
        {loading
          ? <Loader2 className="size-4 opacity-40 animate-spin shrink-0" />
          : <ChevronDown className={cn('size-4 opacity-30 shrink-0 transition-transform', open && 'rotate-180')} />
        }

        {/* Dropdown */}
        {open && (
          <div className="absolute left-0 top-full z-50 mt-1.5 w-full rounded-md border border-foreground/10 bg-popover text-popover-foreground shadow-md max-h-60 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <p className="py-3 text-center text-sm text-muted-foreground">
                {loading ? 'Searching…' : 'No options found.'}
              </p>
            ) : (
              <ul>
                {filteredOptions.map((opt, i) => (
                  <li
                    key={opt.value}
                    className={cn(
                      'cursor-default select-none px-3 py-2 text-sm transition-colors',
                      i === highlighted
                        ? 'bg-accent text-accent-foreground'
                        : 'hover:bg-accent hover:text-accent-foreground',
                    )}
                    onMouseEnter={() => setHighlighted(i)}
                    onMouseDown={(e) => { e.preventDefault(); select(opt.value) }}
                  >
                    {opt.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Selected chips */}
      {selectedValues.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {selectedValues.map((val) => (
            <span
              key={val}
              className="group relative flex items-center gap-1.5 rounded-full border border-blue-100 bg-slate-50 px-4 py-1.5 text-sm text-slate-600"
            >
              {getLabel(val)}
              <button
                type="button"
                onClick={() => remove(val)}
                className="ml-0.5 flex size-4 items-center justify-center rounded-full bg-red-100 text-red-500 opacity-70 transition-opacity hover:opacity-100"
                aria-label={`Remove ${getLabel(val)}`}
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


// export function SkillPill({ value, allOptions }: { value: string, allOptions: SelectOption[] }) {
//   const getLabel = (val: string) =>
//     allOptions.find((o) => o.value === val)?.label ?? val

//   return (
//     <div className="mt-3 flex flex-wrap gap-2">
//       {selectedValues.map((val) => (
//         <span
//           key={val}
//           className="group relative flex items-center gap-1.5 rounded-full border border-blue-100 bg-slate-50 px-4 py-1.5 text-sm text-slate-600"
//         >
//           {getLabel(val)}
//           <button
//             type="button"
//             onClick={() => remove(val)}
//             className="ml-0.5 flex size-4 items-center justify-center rounded-full bg-red-100 text-red-500 opacity-70 transition-opacity hover:opacity-100"
//             aria-label={`Remove ${getLabel(val)}`}
//           >
//             <X className="size-2.5" />
//           </button>
//         </span>
//       ))}
//     </div>
//   )
// }