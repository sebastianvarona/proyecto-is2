import CounselingList from '~/lib/components/CounselingList';
import Sidebar from '~/lib/components/Sidebar';
import dayPickerStyles from '~/styles/daypicker.css';
import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { getUser, requireUser } from '~/lib/utils/session.server';
import { getGroupsFromUser } from '~/lib/models/group.server';
import type { User } from '~/lib/models/user.server';
import { getTeachers } from '~/lib/models/user.server';
import { getCounselingsFromStudent } from '~/lib/models/counseling.server';
import { Link, Outlet, useLoaderData } from '@remix-run/react';

interface StudentCounseling {
  id: string;
  date: Date;
  description: string;
  status: number;
  teacher: {
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

  const query = new URLSearchParams(request.url.split('?')[1]);
  const monthYear = query.get('monthYear');
  const [monthString, yearString] = monthYear?.split('-') ?? [null, null];
  const date = new Date();
  const month = monthString ? +monthString : date.getMonth() + 1;
  const year = yearString ? +yearString : date.getFullYear();

  // groups that the user is in
  const groups = await getGroupsFromUser(user?.id!);

  // teachers that are in the same groups as the user
  const teachers = await getTeachers(groups);

  const counselings: StudentCounseling[] = await getCounselingsFromStudent(
    user?.id!,
    month,
    year
  );

  return json({
    user,
    teachers,
    counselings,
    groups,
    month: month - 1,
    year,
  });
};

export function links() {
  return [{ rel: 'stylesheet', href: dayPickerStyles }];
}

export default function StudentRoute() {
  const data = useLoaderData<typeof loader>();
  const teachers = data.teachers as User[];

  return (
    <>
      <Outlet />

      {/* SIDEBAR */}
      <Sidebar
        teachers={teachers}
        activeMonth={new Date(data.year, data.month)}
      />
      <div className="h-screen max-h-screen col-span-9 p-8">
        <div className="px-4 pt-20 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-2xl font-semibold leading-6 text-gray-900">
                Asesorías
              </h1>
            </div>
            <div className={'mt-4 sm:ml-16 sm:mt-0 sm:flex-none'}>
              <Link
                to="add"
                type="button"
                className="block px-3 py-2 text-sm font-semibold text-center text-white rounded-md shadow-sm bg-primary hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Agregar asesoría
              </Link>
            </div>
          </div>
          <CounselingList role="student" data={data} />
        </div>
      </div>
    </>
  );
}
