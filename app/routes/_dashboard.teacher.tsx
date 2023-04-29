import CounselingList from '~/lib/components/CounselingList';
import dayPickerStyles from '~/styles/daypicker.css';
import type { LoaderArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { json } from '@remix-run/node';
import { getUser, requireUser } from '~/lib/utils/session.server';
import { getGroupsFromUser } from '~/lib/models/group.server';
import { getCounselingsFromTeacher } from '~/lib/models/counseling.server';
import { Link, Outlet, useLoaderData } from '@remix-run/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

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

  if (!user?.isTeacher) return redirect('/');

  const query = new URLSearchParams(request.url.split('?')[1]);
  const monthYear = query.get('monthYear');
  const [monthString, yearString] = monthYear?.split('-') ?? [null, null];
  const date = new Date();
  const month = monthString ? +monthString - 1 : date.getMonth();
  const year = yearString ? +yearString : date.getFullYear();

  // groups that the user is in
  const groups = await getGroupsFromUser(user?.id!);

  const counselings: TeacherCounseling[] = await getCounselingsFromTeacher(
    user?.id!,
    month,
    year
  );

  return json({
    user,
    counselings,
    groups,
    month,
    year,
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
        <div className="mx-auto max-w-7xl">
          <div className="px-4 pt-20 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h1 className="text-2xl font-semibold leading-6 text-gray-900">
                  Asesorías
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  to={`/teacher?monthYear=${format(
                    new Date(data.year, data.month - 1),
                    'MM-yyyy'
                  )}`}
                  className="text-primary"
                >
                  <ChevronLeftIcon className="w-6 h-6" />
                </Link>
                <h1 className="text-2xl font-medium capitalize text-primary">
                  {format(new Date(data.year, data.month), 'MMMM yyyy', {
                    locale: es,
                  })}
                </h1>
                <Link
                  to={`/teacher?monthYear=${format(
                    new Date(data.year, data.month + 1),
                    'MM-yyyy'
                  )}`}
                  className="text-primary"
                >
                  <ChevronRightIcon className="w-6 h-6" />
                </Link>
              </div>
            </div>
            <CounselingList role="teacher" data={data} />
          </div>
        </div>
      </div>
    </>
  );
}
