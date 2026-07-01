// Components
import { Head, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import TextLink from '@/components/text-link';
import { Input } from '@/components/form/input';
import { login } from '@/routes';
import { email } from '@/routes/password';
import SubmitButton from '@/components/form/submit-button';

export default function ForgotPassword({ status }: { status?: string }) {
  const form = useForm({
    email: "",
    password: ""
  }).withPrecognition(email)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    form.submit()
  }

  return (
    <>
      <Head title="Forgot password" />

      {status && (
        <div className="mb-4 text-center text-sm font-medium text-green-600">
          {status}
        </div>
      )}

      <div className="space-y-6">
        <form onSubmit={handleSubmit}>
          <Input
            id="email"
            type="email"
            form={form}
            name="email"
            label="Email address"
            autoComplete="off"
            autoFocus
            placeholder="email@example.com"
          />

          <div className="my-6 flex items-center justify-start">
            <SubmitButton
              className="w-full"
              data-test="email-password-reset-link-button"
              label="Email password reset link"
              form={form}
            />
          </div>
        </form>

        <div className="space-x-1 text-center text-sm text-muted-foreground">
          <span>Or, return to</span>
          <TextLink href={login()}>log in</TextLink>
        </div>
      </div>
    </>
  );
}

ForgotPassword.layout = {
  title: 'Forgot password',
  description: 'Enter your email to receive a password reset link',
};
