import * as React from "react"
import type { FormComponentRef } from '@inertiajs/core';
import { CheckIcon } from "lucide-react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"

import { cn, handleFormData } from "@/lib/utils"
import { Label } from "./label"
import { InertiaFormProps, useFormContext } from "@inertiajs/react"
import { Field, FieldContent, FieldDescription, FieldLabel, FieldLegend, FieldSet } from "./field";
import { SelectOptions } from "@/types";

export function CheckboxComponent({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer size-4 shrink-0 rounded-[4px] border border-input shadow-xs transition-shadow outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:bg-input/30 dark:aria-invalid:ring-destructive/40 dark:data-[state=checked]:bg-primary",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}



type Props<T extends object> = Omit<React.ComponentProps<typeof CheckboxPrimitive.Root>, 'form'> & {
  label?: string | React.ReactNode;
  description?: string | React.ReactNode;
  name: string;
  options: SelectOptions[]
  classNames?: {
    label?: string;
    description?: string;
    error?: string;
    wrapper?: string;
    field?: {
      wrapper?: string;
      content?: string
      label?: string;
      description?: string;
    }
  }
  orientation?: 'vertical' | 'horizontal'
  form?: InertiaFormProps<T>
}


export function Checkbox<T extends object>({ classNames, label, name, form, options, ...props }: Props<T>) {
  const formContext = useFormContext() as FormComponentRef

  let componentProps = (_: SelectOptions) => props
  let error = null;

  if (form) {
    const { value, error: formError, handleChange } = handleFormData(name, form) || {}
    error = formError

    console

    componentProps = (option: SelectOptions) => ({
      checked: (value as string[])?.includes(option.value),
      onCheckedChange: (checked) => {
        if (checked && handleChange) {
          handleChange(option.value);
        }
        // You can add your custom logic here
      },
      ...props
    })
  }

  return (
    <FieldSet className={cn('w-full', classNames?.wrapper)}>
      {
        label ?
          typeof (label) === 'string'
            ? <FieldLegend variant="label" className={cn('font-medium', classNames?.label)}>{label}</FieldLegend>
            : label
          : null
      }
      {
        props?.description && <FieldDescription className={cn('', classNames?.description)}>
          {props.description}
        </FieldDescription>
      }

      {
        options?.map((option) => (
          <Field orientation={props?.orientation ?? 'horizontal'}>
            <CheckboxComponent
              id={option.value}
              name={option.value}
              // defaultChecked={}
              {...componentProps(option)}
            />
            <FieldContent>
              <FieldLabel htmlFor={option.value}>
                {option.label}
              </FieldLabel>
            </FieldContent>
          </Field>
        ))
      }

      {
        form
          ? form.hasErrors && error && <small className={cn("text-red-500 text-sm", classNames?.error)}>{error as string}</small>
          : formContext
            ? (formContext as FormComponentRef).invalid(name) && <small className={cn("text-red-500 text-sm", classNames?.error)}>{(formContext as FormComponentRef).errors?.[name]}</small>
            : null
      }
    </FieldSet >
  )
}
