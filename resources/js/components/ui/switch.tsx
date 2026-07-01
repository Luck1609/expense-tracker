import * as React from "react"
import type { FormComponentRef } from '@inertiajs/core';
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn, handleFormData } from "@/lib/utils"
import { Label } from "./label"
import { InertiaFormProps, useFormContext } from "@inertiajs/react"

export function SwitchComponent({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitives.Root>) {
  return (
    <SwitchPrimitives.Root
      data-slot="switch"
      className={cn(
        "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
        className
      )}
      {...props}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
        )}
      />
    </SwitchPrimitives.Root>
  )
}



type Props<T extends object> = Omit<React.ComponentProps<typeof SwitchPrimitives.Root>, 'form'> & {
  label?: string | React.ReactNode;
  name: string;
  classNames?: {
    label?: string;
    error?: string;
    wrapper?: string;
  }
  form?: InertiaFormProps<T>
}


export function Switch<T extends object>({ classNames, label, name, form, ...props }: Props<T>) {
  const formContext = useFormContext() as FormComponentRef

  let componentProps = { ...props }
  let error = null;

  if (form) {
    const { value, error: formError, handleChange } = handleFormData(name, form) || {}
    error = formError

    componentProps = {
      checked: value as boolean,
      onCheckedChange: (checked: boolean) => {
        form.setData(name as any, checked as any)
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

      {form
        ? form.hasErrors && error && <small className={cn("text-red-500 text-sm", classNames?.error)}>{error as string}</small>
        : formContext
          ? (formContext as FormComponentRef).invalid(name) && <small className={cn("text-red-500 text-sm", classNames?.error)}>{(formContext as FormComponentRef).errors?.[name]}</small>
          : null
      }
    </div>
  )
}
