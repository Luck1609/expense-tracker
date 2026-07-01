import { Head, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import TextLink from '@/components/text-link';
import { Checkbox } from '@/components/form/checkbox';
import { Input, Password } from '@/components/form/input';
import { Label } from '@/components/ui/label';
/* @chisel-registration */
import { register } from '@/routes';
/* @end-chisel-registration */
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import SubmitButton from '@/components/form/submit-button';


export default function Login() {
  const form = useForm({
    email: "",
    password: ""
  }).withPrecognition(store)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    form.submit()
  }

  return (
    <>
      <Head title="Log in" />

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <Input
          type="email"
          name="email"
          form={form}
          required
          label="Email address"
          placeholder="email@example.com"
        />

        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <TextLink
              href={request()}
              className="ml-auto text-sm"
              tabIndex={5}
            >
              Forgot your password?
            </TextLink>
          </div>
          <Password
            name="password"
            form={form}
            required
            tabIndex={2}
            label="Password"
            placeholder="Password"
          />


          <Checkbox
            name="remember"
            tabIndex={3}
            form={form}
            label="Remember me"
            isBoolean
          />

          <SubmitButton
            type="submit"
            className="mt-4 w-full"
            tabIndex={4}
            form={form}
            data-test="login-button"
            label="Log in"
          />
        </div>

        {/* @chisel-registration */}
        <div className="text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <TextLink href={register()} tabIndex={5}>
            Sign up
          </TextLink>
        </div>
      </form>
    </>
  );
}

Login.layout = {
  title: 'Log in to your account',
  description: 'Enter your email and password below to log in',
};
