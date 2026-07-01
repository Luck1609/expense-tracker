import { Head, useForm, usePage, Link } from '@inertiajs/react';
/* @chisel-email-verification */
import type { FormEvent } from 'react';
/* @end-chisel-email-verification */
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/form/input';
import profile, { edit } from '@/routes/profile';
import type { Auth } from '@/types';
/* @chisel-email-verification */
import { send } from '@/routes/verification';
/* @end-chisel-email-verification */

type PageProps = {
  auth: Auth;
};

export default function Profile(
  /* @chisel-email-verification */
  {
    mustVerifyEmail,
    status,
  }: {
    mustVerifyEmail: boolean;
    status?: string;
  },
  /* @end-chisel-email-verification */
) {
  const { auth } = usePage<PageProps>().props;
  const form = useForm({
    name: auth.user.name ?? "",
    email: auth.user.email ?? "",
  }).withPrecognition(profile.update())


  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    form.submit()
  }

  return (
    <>
      <Head title="Profile settings" />

      <h1 className="sr-only">Profile settings</h1>

      <div className="space-y-6">
        <Heading
          variant="small"
          title="Profile"
          description="Update your name and email address"
        />

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
                <Input
                  name="name"
                  form={form}
                  label="Name"
                  className="mt-1 block w-full"
                />

                <Input
                  name="email"
                  form={form}
                  label="Email address"
                  type="email"
                  placeholder="Email address"
                />

              {/* @chisel-email-verification */}
              {mustVerifyEmail &&
                auth.user.email_verified_at === null && (
                  <div>
                    <p className="-mt-4 text-sm text-muted-foreground">
                      Your email address is unverified.{' '}
                      <Link
                        href={send()}
                        as="button"
                        className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                      >
                        Click here to re-send the
                        verification email.
                      </Link>
                    </p>

                    {status ===
                      'verification-link-sent' && (
                        <div className="mt-2 text-sm font-medium text-green-600">
                          A new verification link has been
                          sent to your email address.
                        </div>
                      )}
                  </div>
                )}
              {/* @end-chisel-email-verification */}

              <div className="flex items-center gap-4">
                <Button
                  disabled={form.processing}
                  data-test="update-profile-button"
                >
                  Save
                </Button>
              </div>
        </form>
      </div>

      <DeleteUser />
    </>
  );
}

Profile.layout = {
  breadcrumbs: [
    {
      title: 'Profile settings',
      href: edit(),
    },
  ],
};
