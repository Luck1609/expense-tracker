import type { InertiaFormProps, InertiaLinkProps } from '@inertiajs/react';
import type { UseHttpPrecognitiveProps } from 'node_modules/@inertiajs/react/types/useHttp';
import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}


// Form inputs
export function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

function deepClone<T>(value: T): T {
  
  if (value === null || typeof value !== 'object') {
    return value;
  }

  if (value instanceof File || value instanceof Blob || value instanceof Date) {
    return value;
  }
  // if (Array.isArray(value)) return value.map(deepClone) as unknown as T;

  if (Array.isArray(value)) {
  
    return value.map((value) => {
        
      const cloned =  deepClone(value)

      return cloned
      
    }) as unknown as T
    
  }

  return Object.fromEntries(
    Object.entries(value as object).map(([k, v]) => {
      return [k, deepClone(v)]
    })
  ) as T;
}

export function setNestedValue(obj: any, path: string, value: any): any {
  const keys = path.split('.')

  const lastKey = keys.pop()

  const target = keys.reduce((current, key) => {
    if (!current[key]) {
      current[key] = {}
    }
    
    return current[key]
  }, obj)

  if (lastKey) {
    target[lastKey] = value
}
  
  return obj
}


export function handleFormData<T extends object>(name: string, form: InertiaFormProps<T> | UseHttpPrecognitiveProps<T>) {

  if (!form) {
    return
  }

  const isNestedPath = name.includes('.')
  const value = isNestedPath ? getNestedValue(form.data, name) : form.data[name as keyof T]
  const error = isNestedPath ? getNestedValue(form.errors, name) : form.errors?.[name as keyof typeof form.errors]

  const handleChange = (fieldData: any) => {
    if (isNestedPath) {
      form.setData((data) => {
        const newData = deepClone(data)
        
        setNestedValue(newData, name, fieldData)

        return newData
      })
    } else {
      // For non-nested paths, use the callback approach to avoid type issues
      form.setData((data) => {
        const updatedData = {
          ...data,
          [name]: Array.isArray(fieldData) ? [...fieldData] : fieldData
        } as T

        return updatedData
      })
    }
  }

  // Precognition helpers - cast form to access precognition methods
  const precogForm = form as any

  const validate = () => {
    if (typeof precogForm.validate === 'function') {
      precogForm.validate(name)
    }
  }

  const touch = () => {
    if (typeof precogForm.touch === 'function') {
      precogForm.touch(name)
    }
  }

  const invalid = (): boolean => {
    if (typeof precogForm.invalid === 'function') {
      return precogForm.invalid(name)
    }

    return form.hasErrors && !!error
  }

  const valid = (): boolean => {
    if (typeof precogForm.valid === 'function') {
      return precogForm.valid(name)
    }

    return false
  }

  const touched = (): boolean => {
    if (typeof precogForm.touched === 'function') {
      return precogForm.touched(name)
    }

    return false
  }

  const validating = !!precogForm.validating

  return {
    value: value ?? '',
    handleChange,
    error,
    validate,
    touch,
    invalid,
    valid,
    touched,
    validating
  }
}