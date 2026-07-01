import * as React from "react"
import type { FormComponentRef } from '@inertiajs/core';

import { cn, handleFormData } from "@/lib/utils"
import { Label } from "./label"
import { InertiaFormProps, useFormContext } from "@inertiajs/react"
import { InputGroup, InputGroupAddon } from "./input-group";
import { Icon } from "@/types";

export function TextareaComponent({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex w-full min-w-0 rounded-md bg-transparent px-3 py-2.5 shadow-none transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm min-h-[60px]",
        // "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        // "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}



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
  form?: InertiaFormProps<T>
  icons?: {
    prefixIcon?: Icon;
    prependIcon?: Icon;
  }
}


export function Textarea<T extends object>({ classNames, label, name, form, icons, ...props }: Props<T>) {
  const formContext = useFormContext() as FormComponentRef

  let componentProps = { ...props }
  let error = null;

  if (form) {
    const { value, error: formError, handleChange } = handleFormData(name, form) || {}
    error = formError

    componentProps = {
      value,
      onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (handleChange) {
          handleChange(e.target.value)
        }
      },
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

      {form
        ? form.hasErrors && error && <small className={cn("text-red-500 text-sm", classNames?.error)}>{error as string}</small>
        : formContext
          ? (formContext as FormComponentRef).invalid(name) && <small className={cn("text-red-500 text-sm", classNames?.error)}>{(formContext as FormComponentRef).errors?.[name]}</small>
          : null
      }
    </div>
  )
}
