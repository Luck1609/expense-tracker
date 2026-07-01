import type { InertiaFormProps } from '@inertiajs/react'
import type { VariantProps } from 'class-variance-authority'
import type { UseHttpPrecognitiveProps } from 'node_modules/@inertiajs/react/types/useHttp'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import Loader from '../loader'
import { Button } from '../ui/button'
import type { buttonVariants } from '../ui/button'

type Props<T extends object> = {
  label?: ReactNode;
  form: InertiaFormProps<T> | UseHttpPrecognitiveProps<T>
} & Omit<React.ComponentProps<"button">, "form"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

export default function SubmitButton<T extends object>({ form, label = "Submit", ...props }: Props<T>) {
  return (
    <Button
      type="submit"
      disabled={form.processing}
      className={cn("flex items-center", props?.className)}
      {...props}
    >
      {form.processing && <Loader />}
      {label}
    </Button>
  )
}
