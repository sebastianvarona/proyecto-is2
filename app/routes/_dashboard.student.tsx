import CounselingList from '~/lib/components/CounselingList';
import dayPickerStyles from '~/styles/daypicker.css';
import type { LoaderArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { json } from '@remix-run/node';
import { getUser, requireUser } from '~/lib/utils/session.server';
import { getGroupsFromUser } from '~/lib/models/group.server';
import type { User } from '~/lib/models/user.server';
import { getTeachers } from '~/lib/models/user.server';
import { getCounselingsFromStudent } from '~/lib/models/counseling.server';
import {
  Form,
  Link,
  Outlet,
  useLoaderData,
  useSearchParams,
} from '@remix-run/react';
import { es } from 'date-fns/locale';
import { format } from 'date-fns';
import {
  ArrowPathRoundedSquareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/solid';

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

  if (user?.isTeacher) return redirect('/');

  const query = new URLSearchParams(request.url.split('?')[1]);
  const dateQP = query.get('date');
  const [monthString, yearString] = dateQP?.split('-') ?? [null, null];
  const date = new Date();
  const month = monthString ? +monthString - 1 : date.getMonth();
  const year = yearString ? +yearString : date.getFullYear();

  const teacherId = query.get('teacher') ?? '';

  // groups that the user is in
  const groups = await getGroupsFromUser(user?.id!);

  // teachers that are in the same groups as the user
  const teachers = await getTeachers(groups);

  const counselings: StudentCounseling[] = await getCounselingsFromStudent(
    user?.id!,
    month,
    year,
    teacherId
  );

  return json({
    user,
    teachers,
    counselings,
    groups,
    month: month,
    year,
    teacherId,
  });
};

export function links() {
  return [{ rel: 'stylesheet', href: dayPickerStyles }];
}

export default function StudentRoute() {
  const data = useLoaderData<typeof loader>();
  const teachers = data.teachers as User[];
  const [searchParams] = useSearchParams();
  const dateQuery = searchParams.get('date');

  return (
    <>
      <Outlet />

      {/* SIDEBAR */}
      <div className="flex flex-col h-screen max-h-screen min-h-screen col-span-3 p-8 pt-20 bg-gray-200">
        {/* CALENDARIO */}
        <Form
          method="GET"
          className="flex items-center justify-between h-32 p-8 mb-8 -mx-8 border border-b-gray-300"
        >
          <button
            type="submit"
            id="date"
            name="date"
            value={format(new Date(data.year, data.month - 1), 'MM-yyyy')}
          >
            <ChevronLeftIcon className="w-6 h-6 text-primary" />
          </button>

          <h1 className="text-2xl font-medium capitalize text-primary">
            {format(new Date(data.year, data.month), 'MMMM yyyy', {
              locale: es,
            })}
          </h1>
          <button
            type="submit"
            id="date"
            name="date"
            value={format(new Date(data.year, data.month + 1), 'MM-yyyy')}
          >
            <ChevronRightIcon className="w-6 h-6 text-primary" />
          </button>
        </Form>
        {/* <div>
        <DayPicker
          mode="single"
          locale={es}
          selected={selectedDate}
          onSelect={(date) => {
            setSelectedDate(date || new Date(Date.now()));
          }}
        />
      </div> */}

        {/* BUSCADOR */}
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-semibold">Profesores</h1>
          <Form method="GET">
            <button
              type="submit"
              id="date"
              name="date"
              value={format(new Date(data.year, data.month), 'MM-yyyy')}
              className="flex items-center gap-4 px-2 py-1 rounded-md text-primary hover:bg-gray-100"
            >
              <span>Limpiar</span>
              <ArrowPathRoundedSquareIcon className="w-6 h-6" />
            </button>
          </Form>
        </div>
        {/* CONTENIDO */}
        <div className="flex-1 overflow-y-scroll">
          <Form method="GET">
            <ul className="flex flex-col gap-3 py-2 pr-4">
              {teachers.map((teacher: User) => (
                <Link
                  key={teacher.id}
                  to={`?date=${dateQuery ? `${dateQuery}&` : null}teacher=${
                    teacher.id
                  }`}
                >
                  <li
                    className={`px-3 py-1 font-medium rounded-md border-2  ${
                      data.teacherId === teacher.id
                        ? 'bg-primary/80 text-white border-primary'
                        : 'bg-white/50 border-gray-300'
                    }`}
                  >
                    {teacher.name}
                  </li>
                </Link>
              ))}
            </ul>
          </Form>
        </div>
      </div>
      {/* <Sidebar
        teachers={teachers}
        activeMonth={new Date(data.year, data.month)}
      /> */}
      <div className="h-screen max-h-screen col-span-9 p-8">
        <div className="px-4 pt-20 sm:px-6 lg:px-8">
          <div className="-mx-4 sm:flex sm:items-center sm:-mx-6 lg:-mx-8">
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
