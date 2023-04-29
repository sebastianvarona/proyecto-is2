import CounselingList from '~/lib/components/CounselingList';
import dayPickerStyles from '~/styles/daypicker.css';
import type { LoaderArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { json } from '@remix-run/node';
import { getUser, requireUser } from '~/lib/utils/session.server';
import { getGroupsFromUser } from '~/lib/models/group.server';
import { getCounselingsFromTeacher } from '~/lib/models/counseling.server';
import { Outlet, useLoaderData } from '@remix-run/react';

interface TeacherCounseling {
  id: string;
  date: Date;
  description: string;
  status: number;
  student: {
    id: string;
    name: string;
  };
  group: {
    id: string;
    name: string;
    subjectName: string;
  };
}

export const loader = async ({ request }: LoaderArgs) => {
  await requireUser(request);
  const user = await getUser(request);

  // groups that the user is in
  const groups = await getGroupsFromUser(user?.id!);

  const counselings: TeacherCounseling[] = await getCounselingsFromTeacher(
    user?.id!
  );

  return json({
    user,
    counselings,
    groups,
  });
};

export function links() {
  return [{ rel: 'stylesheet', href: dayPickerStyles }];
}

export default function TeacherRoute() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <Outlet />
      <div className="col-span-12 p-8">
        <div className="px-4 pt-20 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-2xl font-semibold leading-6 text-gray-900">
                Asesorías
              </h1>
            </div>
          </div>
          <CounselingList role="teacher" data={data} />
        </div>
      </div>
    </>
  );
}
