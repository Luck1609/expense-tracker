import type { FormComponentRef } from '@inertiajs/core';
import { useFormContext } from "@inertiajs/react"
import type { InertiaFormProps } from "@inertiajs/react"
import type { Root } from "@radix-ui/react-switch"
import type { UseHttpPrecognitiveProps } from "node_modules/@inertiajs/react/types/useHttp"
import * as React from "react"

import { Label } from "@/components/ui/label"
import { SwitchComponent } from '@/components/ui/switch';
import { cn, handleFormData } from "@/lib/utils"





type Props<T extends object> = Omit<React.ComponentProps<typeof Root>, 'form'> & {
  label?: string | React.ReactNode;
  name: string;
  classNames?: {
    label?: string;
    error?: string;
    wrapper?: string;
  }
  form: InertiaFormProps<T> | UseHttpPrecognitiveProps<T>
}


export function Switch<T extends object>({ classNames, label, name, form, ...props }: Props<T>) {
  const formContext = useFormContext() as FormComponentRef

  let componentProps = { ...props }
  let error = null;
  let validate: (() => void) | undefined;
  let touch: (() => void) | undefined;
  let invalid: (() => boolean) | undefined;
  // let validating = false;

  if (form) {
    const { value, error: formError, handleChange: handleFormChange, validate: formValidate, touch: formTouch, invalid: formInvalid } = handleFormData(name, form) || {}
    error = formError
    validate = formValidate
    touch = formTouch
    invalid = formInvalid

    componentProps = {
      checked: value as boolean,
      onCheckedChange: (checked: boolean) => {
        if (handleFormChange) {
          handleFormChange(checked)
          touch?.()
          validate?.()
        }
      },
      ...props
    }
  }

  return (
    <div className={cn('w-full space-y-1.5 relative', classNames?.wrapper)}>
      <div className="flex items-center gap-2">
        <SwitchComponent
          id={name}
          name={name}
          {...componentProps}
        />

        {
          label ?
            typeof (label) === 'string'
              ? <Label htmlFor={name} className={cn('font-medium cursor-pointer', classNames?.label)}>{label}</Label>
              : label
            : null
        }
      </div>

      {/* Validation error display */}
      {(invalid?.() || (formContext && (formContext as FormComponentRef).invalid(name))) && error && (
        <small className={cn("text-red-500 text-sm", classNames?.error)}>
          {error as string}
        </small>
      )}
    </div>
  )
}
