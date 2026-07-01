import type { InertiaFormProps } from "@inertiajs/react"
import { Eye, EyeClosed } from "lucide-react"
import type { UseHttpPrecognitiveProps } from 'node_modules/@inertiajs/react/types/useHttp';
import * as React from "react"

import { InputGroup, InputGroupAddon } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label"
import { cn, handleFormData } from "@/lib/utils"
import type { Icon } from "@/types";
import { InputComponent } from "../ui/input";


type Props<T extends object> = Omit<React.ComponentProps<"input">, 'form'> & {
  label?: string | React.ReactNode;
  name: string;
  classNames?: {
    label?: string;
    error?: string;
    wrapper?: string;
    passwordIcon?: string;
    prefixIcon?: string;
    prependIcon?: string;
  }
  form: InertiaFormProps<T> | UseHttpPrecognitiveProps<T>
  icons?: {
    prefixIcon?: Icon;
    prependIcon?: Icon;
  }
}


export function Input<T extends object>({ classNames, label, name, form, icons, ...props }: Props<T>) {
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        <InputComponent
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
          (icons?.prependIcon) && (
            <InputGroupAddon align="inline-end">
              {
                icons?.prependIcon && <icons.prependIcon className={cn('', classNames?.prependIcon)} />
              }

            </InputGroupAddon>
          )
        }
      </InputGroup>

      {/* Validation error display - shows when field is invalid (touched or has error) */}
      {invalid?.() && error && (
        <small className={cn("text-red-500 text-sm", classNames?.error)}>
          {error as string}
        </small>
      )}
    </div>
  )
}

export function Password<T extends object>(options: Props<T>) {
  const [showText, setShowText] = React.useState(false)

  const toggleShowText = () => setShowText(prev => !prev)

  const Icon = () => !showText
    ? <Eye onClick={toggleShowText} className="cursor-pointer" />
    : <EyeClosed onClick={toggleShowText} className="cursor-pointer" />

  const { icons, ...props } = options

  const componentProps = {
    type: showText ? 'text' : 'password',
    ...props,
    icons: {
      ...icons,
      prependIcon: Icon,
    }
  }

  return (
    <Input {...componentProps} />
  )
}