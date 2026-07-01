import { Head, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/password/confirm';
import { Password } from '@/components/form/input';

export default function ConfirmPassword() {
  const form = useForm({
    password: ""
  }).withPrecognition(store)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    form.submit()
  }

  return (
    <>
      <Head title="Confirm password" />

      <form onSubmit={handleSubmit} className="space-y-6">
        <Password
          name="password"
          placeholder="Password"
          label="Password"
          form={form}
          autoFocus
        />

        <div className="flex items-center">
          <Button
            className="w-full"
            disabled={form.processing}
            data-test="confirm-password-button"
          >
            {form.processing && <Spinner />}
            Confirm password
          </Button>
        </div>
      </form>
    </>
  );
}

ConfirmPassword.layout = {
  title: 'Confirm password',
  description:
    'This is a secure area of the application. Please confirm your password before continuing.',
};
