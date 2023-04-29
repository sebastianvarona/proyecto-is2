import { requireUser } from "~/lib/utils/session.server";

import Navbar from "~/lib/components/Navbar";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";

export const loader = async ({ request }: LoaderArgs) => {
  const user = await requireUser(request);

  return json({ user });
};

export default function DashboardLayout() {
  const { user } = useLoaderData<typeof loader>();
  return (
    <>
      <div className="fixed top-0 left-0 w-screen">
        <Navbar user={user} />
      </div>
      <main className="grid grid-cols-12">
        <Outlet />
      </main>
    </>
  );
}
