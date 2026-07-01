import type { FormComponentRef } from '@inertiajs/core';
import { useFormContext } from "@inertiajs/react"
import type { InertiaFormProps } from "@inertiajs/react"
import type { UseHttpPrecognitiveProps } from "node_modules/@inertiajs/react/types/useHttp"
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label"
import { TextareaComponent } from "@/components/ui/textarea";
import { cn, handleFormData } from "@/lib/utils"
import type { Icon } from "@/types";


type Props<T extends object> = Omit<React.ComponentProps<"textarea">, 'form'> & {
  label?: string | React.ReactNode;
  name: string;
  classNames?: {
    label?: string;
    error?: string;
    wrapper?: string;
    prefixIcon?: string;
    prependIcon?: string;
  }
  form: InertiaFormProps<T> | UseHttpPrecognitiveProps<T>
  icons?: {
    prefixIcon?: Icon;
    prependIcon?: Icon;
  }
}


export function Textarea<T extends object>({ classNames, label, name, form, icons, ...props }: Props<T>) {
  const formContext = useFormContext() as FormComponentRef

  let componentProps = { ...props }
  let error = null;
  let validate: (() => void) | undefined;
  let touch: (() => void) | undefined;
  let invalid: (() => boolean) | undefined;

  if (form) {
    const { value, error: formError, handleChange: handleFormChange, validate: formValidate, touch: formTouch, invalid: formInvalid } = handleFormData(name, form) || {}
    error = formError
    validate = formValidate
    touch = formTouch
    invalid = formInvalid

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (handleFormChange) {
        handleFormChange(e.target.value)
      }
    }

    const handleBlur = () => {
      touch?.()
      validate?.()
    }

    componentProps = {
      value,
      onChange: handleChange,
      onBlur: handleBlur,
      ...props
    }
  }

  return (
    <div className={cn('w-full space-y-1.5 relative', classNames?.wrapper)}>
      {
        label ?
          typeof (label) === 'string'
            ? <Label htmlFor={name} className={cn('font-medium', classNames?.label)}>{label}</Label>
            : label
          : null
      }

      <InputGroup>
        <TextareaComponent
          id={name}
          name={name}
          {...componentProps}
        />

        {
          icons?.prefixIcon && (
            <InputGroupAddon align="inline-start">
              <icons.prefixIcon className={cn('', classNames?.prefixIcon)} />
            </InputGroupAddon>
          )
        }
        {
          icons?.prependIcon && (
            <InputGroupAddon align="inline-end">
              <icons.prependIcon className={cn('', classNames?.prependIcon)} />
            </InputGroupAddon>
          )
        }
      </InputGroup>

      {/* Validation error display */}
      {(invalid?.() || (formContext && (formContext as FormComponentRef).invalid(name))) && error && (
        <small className={cn("text-red-500 text-sm", classNames?.error)}>
          {error as string}
        </small>
      )}
    </div>
  )
}
