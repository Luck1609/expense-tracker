import type { InertiaFormProps } from "@inertiajs/react"
import type { UseHttpPrecognitiveProps } from 'node_modules/@inertiajs/react/types/useHttp';
import type { RadioGroup as RadioGroupPrimitive } from "radix-ui"
import * as React from "react"

import { Field, FieldContent, FieldDescription, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { RadioGroupComponent, RadioGroupItem } from '@/components/ui/radio-group';
import { cn, handleFormData } from "@/lib/utils"
import type { SelectOptions } from "@/types";


type Props<T extends object> = Omit<React.ComponentProps<typeof RadioGroupPrimitive.Root>, 'form'> & {
  label?: React.ReactNode;
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
      item?: string;
      container?: string;
    }
  }
  form: InertiaFormProps<T> | UseHttpPrecognitiveProps<T>
  // children: React.ReactNode;
}


export function RadioGroup<T extends object>({ classNames, label, name, form, options, orientation = 'horizontal', ...props }: Props<T>) {

  let componentProps = { ...props }
  let error = null;
  let validate: (() => void) | undefined;
  let touch: (() => void) | undefined;
  let invalid: (() => boolean) | undefined;

  if (form) {
    const { value, error: formError, handleChange, validate: formValidate, touch: formTouch, invalid: formInvalid } = handleFormData(name, form) || {}
    error = formError
    validate = formValidate
    touch = formTouch
    invalid = formInvalid

    const handleValueChange = (newValue: string) => {
      handleChange?.(newValue)
      touch?.()
      validate?.()
    }

    componentProps = {
      value: value as string,
      onValueChange: handleValueChange,
      ...props
    }
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

      <RadioGroupComponent
        id={name}
        name={name}
        {...componentProps}
      >
        {
          options.map(({ label, value, description }, index) => (
            <FieldLabel key={`${index}-${value}`} htmlFor={value} className={cn("relative", classNames?.field?.wrapper)}>
              <Field orientation={orientation} className={cn('', classNames?.field?.container)}>
                <RadioGroupItem value={value} id={value} className={cn('', classNames?.field?.item)} />
                <FieldContent className={cn('', classNames?.field?.content)}>
                  <span className={cn('', classNames?.field?.label)}>{label}</span>
                  {
                    description && (
                      <FieldDescription className={cn('', classNames?.field?.description)}>
                        {description}
                      </FieldDescription>
                    )
                  }
                </FieldContent>
              </Field>
            </FieldLabel>
          ))
        }
      </RadioGroupComponent>

      {/* Validation error display */}
      {invalid?.() && error && (
        <small className={cn("text-red-500 text-sm", classNames?.error)}>
          {error as string}
        </small>
      )}
    </FieldSet>
  )
}