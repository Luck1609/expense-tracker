import { Head, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { edit } from '@/routes/security';
/* @chisel-passkeys */
import type { Props as ManagePasskeysProps } from '@/components/manage-passkeys';
import ManagePasskeys from '@/components/manage-passkeys';
/* @end-chisel-passkeys */
/* @chisel-2fa */
import type { Props as ManageTwoFactorProps } from '@/components/manage-two-factor';
import ManageTwoFactor from '@/components/manage-two-factor';
import { Password } from '@/components/form/input';
/* @end-chisel-2fa */

type Props = {
  passwordRules: string;
} /* @chisel-passkeys */ & ManagePasskeysProps /* @end-chisel-passkeys */ /* @chisel-2fa */ &
  ManageTwoFactorProps /* @end-chisel-2fa */;

export default function Security(props: Props) {
  const form = useForm({
    password: "",
    password_confirmation: "",
    current_password: "",
  }).withPrecognition(edit)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    form.submit({
      onSuccess: () => {
        form.reset()
      }
    })
  }

  return (
    <>
      <Head title="Security settings" />

      <h1 className="sr-only">Security settings</h1>

      <div className="space-y-6">
        <Heading
          variant="small"
          title="Update password"
          description="Ensure your account is using a long, random password to stay secure"
        />

        <form onSubmit={handleSubmit} className="space-y-6">
          <Password
            form={form}
            name="current_password"
            label="Current password"
            placeholder="Current password"
          />


          <Password
            form={form}
            name="password"
            className="mt-1 block w-full"
            label="New password"
            placeholder="New password"
            passwordrules={props.passwordRules}
          />

          <Password
            form={form}
            name="password_confirmation"
            className="mt-1 block w-full"
            label="Confirm password"
            placeholder="Confirm password"
            passwordrules={props.passwordRules}
          />

          <div className="flex items-center gap-4">
            <Button
              disabled={form.processing}
              data-test="update-password-button"
            >
              Save
            </Button>
          </div>
        </form>
      </div>

      {/* @chisel-2fa */}
      <ManageTwoFactor
        canManageTwoFactor={props.canManageTwoFactor}
        requiresConfirmation={props.requiresConfirmation}
        twoFactorEnabled={props.twoFactorEnabled}
      />
      {/* @end-chisel-2fa */}

      {/* @chisel-passkeys */}
      <ManagePasskeys
        canManagePasskeys={props.canManagePasskeys}
        passkeys={props.passkeys}
      />
      {/* @end-chisel-passkeys */}
    </>
  );
}

Security.layout = {
  breadcrumbs: [
    {
      title: 'Security settings',
      href: edit(),
    },
  ],
};
