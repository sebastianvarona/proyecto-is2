import type { Counseling } from "~/lib/components/CounselingList";
import CounselingList from "~/lib/components/CounselingList";

import { LoaderArgs, redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getUser, requireUser } from "~/lib/utils/session.server";
import { getGroupsFromUser } from "~/lib/models/group.server";
import { getCounselingsFromTeacher } from "~/lib/models/counseling.server";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ request }: LoaderArgs) => {
  await requireUser(request);
  const user = await getUser(request);

  if (!user!.isTeacher) return redirect("/student");

  // groups that the user is in
  const groups = await getGroupsFromUser(user?.id!);

  const counselings: Counseling[] = await getCounselingsFromTeacher(user?.id!);

  return json({
    user,
    counselings,
    groups,
  });
};

export default function TeacherRoute() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="col-span-12 p-8">
      <div className="px-4 pt-20 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold leading-6 text-gray-900">
              Asesorías
            </h1>
          </div>
        </div>
        <CounselingList canCreate data={data} />
      </div>
    </div>
  );
}
