import {
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  UserGroupIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { Popover } from '@headlessui/react';
import { DayPicker } from 'react-day-picker';
import { Form, useLoaderData } from '@remix-run/react';
import { useState } from 'react';
import type { Group } from '@prisma/client';
import { getGroupsFromUser } from '~/lib/models/group.server';
import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { json } from '@remix-run/node';
import { getUser, requireUser } from '~/lib/utils/session.server';
import { format } from 'date-fns';
import es from 'date-fns/locale/es';
import { getTeacherFromGroup } from '~/lib/models/user.server';
import { createCounseling } from '~/lib/models/counseling.server';
import { StatusType } from '~/lib/utils/types';

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();

  const closed = formData.get('closed');
  if (Number(closed)) return redirect('/student');

  const group = formData.get('group');
  const date = formData.get('date');
  const time = formData.get('time');
  const description = formData.get('description');

  // Datetime variable
  const datetime = new Date(`${date} ${time}`);

  const user = await getUser(request);
  const teacher = await getTeacherFromGroup(group as string);

  await createCounseling({
    studentId: user?.id!,
    teacherId: teacher?.id!,
    groupId: group as string,
    date: datetime,
    description: description as string,
    status: StatusType.PENDIENTE,
  });

  return redirect('/student');
}

export const loader = async ({ request }: LoaderArgs) => {
  await requireUser(request);
  const user = await getUser(request);

  // groups that the user is in
  const groups = await getGroupsFromUser(user?.id!);

  return json({
    user,
    groups,
  });
};

export default function AddCounseling() {
  const data = useLoaderData<typeof loader>();
  const [selectedGroup, setSelectedGroup] = useState<Group>(data.groups[0]);
  const [wasClosed, setWasClosed] = useState<boolean>(false);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date(Date.now()));

  return (
    <>
      <div className="fixed top-0 left-0 z-10 w-screen h-screen bg-black/20 backdrop-blur-sm" />
      <Form
        method="POST"
        className="fixed top-0 bottom-0 left-0 right-0 z-20 flex items-center justify-center"
      >
        <div className="w-full max-w-md p-6 overflow-visible text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <h3 className="flex justify-between text-lg font-medium leading-6 text-gray-900">
            <span>Nueva Asesoría</span>
            <button type="submit">
              <XMarkIcon
                className="w-6 h-6 text-gray-400"
                onClick={() => {
                  setWasClosed(true);
                }}
              />
            </button>
          </h3>
          <div className="grid grid-flow-row grid-cols-1 gap-2 mt-1">
            {/* FORM */}
            <input type="hidden" name="closed" value={Number(wasClosed)} />
            <div>
              <label
                htmlFor="group"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Asignatura
              </label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <UserGroupIcon
                    className="w-5 h-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>

                <select
                  name="group"
                  value={selectedGroup.id}
                  onChange={(e) => {
                    console.log(e.target.value);
                    const group = data.groups.find(
                      (group: Group) => group.id === e.target.value
                    );
                    console.log(group);
                    setSelectedGroup(group as Group);
                  }}
                  id="group"
                  className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 outline-none"
                >
                  {data.groups.map((group: Group) => (
                    <option key={group.id} value={group.id}>
                      {group.subjectName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Grupo
              </label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <ClipboardDocumentListIcon
                    className="w-5 h-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <input
                  type="text"
                  readOnly
                  disabled
                  className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 outline-none"
                  placeholder="Ingeniería de Software"
                  value={selectedGroup.name}
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Fecha
              </label>
              <input
                type="hidden"
                name="date"
                id="date"
                value={format(selectedDate, 'yyyy-MM-dd')}
              />
              <div className="relative mt-2 rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <CalendarDaysIcon
                    className="w-5 h-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <Popover className="relative block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 outline-none">
                  <Popover.Button className="w-full text-left">
                    {format(selectedDate, 'PPP', {
                      locale: es,
                    })}
                  </Popover.Button>

                  <Popover.Panel className="absolute z-10 bg-white rounded-md shadow-md">
                    <DayPicker
                      mode="single"
                      locale={es}
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date || new Date(Date.now()));
                      }}
                    />
                  </Popover.Panel>
                </Popover>
              </div>
            </div>
            <div>
              <label
                htmlFor="time"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Hora
              </label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <ClockIcon
                    className="w-5 h-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <input
                  type="time"
                  name="time"
                  id="time"
                  className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 outline-none"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Razón
              </label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <textarea
                  name="description"
                  minLength={3}
                  id="description"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 outline-none"
                  placeholder="Escribe una razón"
                />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <button
              type="submit"
              className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md bg-primary/80 hover:bg-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              Crear
            </button>
          </div>
        </div>
      </Form>
    </>
  );
}
