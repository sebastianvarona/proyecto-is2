import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import CounselingList from "~/lib/components/CounselingList";
import Navbar from "~/lib/components/Navbar";
import { getUser, requireUser } from "~/lib/utils/session.server";

export const loader = async ({ request }: LoaderArgs) => {
  await requireUser(request);
  const user = await getUser(request);

  if (!user?.isTeacher) return redirect("/");

  return json({
    user,
  });
};

export default function TeacherRoute() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <div className="fixed top-0 left-0 w-screen">
        <Navbar user={data.user?.email!} />
      </div>
      <main>
        <div className="h-screen max-h-screen p-8">
          {/* LISTA */}
          <CounselingList />
        </div>
      </main>
    </>
  );
}
