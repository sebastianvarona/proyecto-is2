import type { ActionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, Link, useActionData } from '@remix-run/react';
import { useEffect, useRef } from 'react';
import { verifyLogin } from '~/lib/models/user.server';
import { createUserSession } from '~/lib/utils/session.server';

export function validateEmail(email: unknown): email is string {
  return typeof email === 'string' && email.length > 3 && email.includes('@');
}

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const email = formData.get('email');
  const password = formData.get('password');
  const remember = formData.get('remember');

  if (!validateEmail(email)) {
    return json(
      { errors: { email: 'Email is invalid', password: null } },
      { status: 400 }
    );
  }

  if (typeof password !== 'string' || password.length === 0) {
    return json(
      { errors: { email: null, password: 'Password is required' } },
      { status: 400 }
    );
  }

  const user = await verifyLogin(email, password);

  if (!user) {
    return json(
      { errors: { email: 'Invalid email or password', password: null } },
      { status: 400 }
    );
  }

  return createUserSession({
    remember: remember === 'on' ? true : false,
    request,
    userId: user.id,
  });
};

export default function LoginRoute() {
  const actionData = useActionData<typeof action>();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <>
      <div className="flex flex-1 min-h-screen">
        <div className="flex flex-col justify-center flex-1 px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="w-full max-w-sm mx-auto lg:w-96">
            <div>
              <div className="flex justify-center">
                <img className="w-32" src="/logo.png" alt="UAO" />
              </div>
              <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Ingresa a tu cuenta
              </h2>
            </div>

            <div className="mt-10">
              <div>
                <Form method="POST" className="space-y-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Correo electrónico
                    </label>
                    <div className="mt-2">
                      <input
                        ref={emailRef}
                        id="email"
                        autoFocus={true}
                        name="email"
                        type="email"
                        autoComplete="email"
                        aria-invalid={
                          actionData?.errors?.email ? true : undefined
                        }
                        aria-describedby="email-error"
                        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                      />
                      {actionData?.errors?.email ? (
                        <div className="pt-1 text-red-700" id="email-error">
                          {actionData.errors.email}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Contraseña
                    </label>
                    <div className="mt-2">
                      <input
                        id="password"
                        ref={passwordRef}
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        aria-invalid={
                          actionData?.errors?.password ? true : undefined
                        }
                        aria-describedby="password-error"
                        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                      />
                      {actionData?.errors?.password ? (
                        <div className="pt-1 text-red-700" id="password-error">
                          {actionData.errors.password}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      Sign in
                    </button>
                  </div>
                </Form>
              </div>

              <div className="mt-10">
                <div className="relative">
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm font-medium leading-6">
                    <span className="px-6 text-gray-900 bg-white">
                      Continuar con
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 mt-6">
                  <Link
                    to={'/'}
                    className="flex w-full items-center outline outline-black/20 justify-center gap-3 rounded-md bg-white px-3 py-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D9BF0]"
                  >
                    <img src="/icons/google.svg" className="w-8" alt="Google" />
                    <span className="text-sm font-semibold leading-6">
                      Google
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative flex-1 hidden w-0 lg:block">
          <img
            className="absolute inset-0 object-cover w-full h-full"
            src="/images/login_bg.jpeg"
            alt=""
          />
        </div>
      </div>
    </>
  );
}
