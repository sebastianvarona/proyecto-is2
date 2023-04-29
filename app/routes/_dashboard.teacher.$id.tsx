import {
  CalendarDaysIcon,
  ClipboardDocumentCheckIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  UserGroupIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { Popover } from '@headlessui/react';
import { DayPicker } from 'react-day-picker';
import { Form, useLoaderData } from '@remix-run/react';
import { useState } from 'react';
import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { json } from '@remix-run/node';
import { requireUser } from '~/lib/utils/session.server';
import { format } from 'date-fns';
import es from 'date-fns/locale/es';
import {
  deleteCounseling,
  getCounseling,
  updateCounselingAsTeacher,
} from '~/lib/models/counseling.server';
import { StatusType } from '~/lib/utils/types';

export async function action({ request, params }: ActionArgs) {
  const formData = await request.formData();
  const counselingId = params.id;

  if (request.method === 'DELETE') {
    await deleteCounseling(counselingId!);
    return redirect('/');
  }

  const closed = formData.get('closed');
  if (Number(closed)) return redirect('/');

  const date = formData.get('date');
  const time = formData.get('time');
  const status = formData.get('status');

  // Datetime variable
  const datetime = new Date(`${date} ${time}`);

  await updateCounselingAsTeacher({
    id: counselingId!,
    status: +status!,
    datetime,
  });

  return redirect('/');
}

export const loader = async ({ request, params }: LoaderArgs) => {
  await requireUser(request);

  const counselingId = params.id!;
  const currentCounseling = await getCounseling(counselingId);

  return json({
    counseling: currentCounseling,
  });
};

export default function Counseling() {
  const data = useLoaderData<typeof loader>();
  const [wasClosed, setWasClosed] = useState<boolean>(false);

  const dateString = data.counseling!.date;
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(dateString));
  const [selectedTime, setSelectedTime] = useState<Date>(new Date(dateString));
  const [status, setStatus] = useState<number>(data.counseling!.status);

  return (
    <>
      <div className="fixed top-0 left-0 z-10 w-screen h-screen bg-black/20 backdrop-blur-sm" />
      <Form
        method="PATCH"
        className="fixed top-0 bottom-0 left-0 right-0 z-20 flex items-center justify-center"
      >
        <div className="w-full max-w-md p-6 overflow-visible text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <h3 className="flex justify-between text-lg font-medium leading-6 text-gray-900">
            <span>Editar Asesoría</span>
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
                htmlFor="status"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Estado
              </label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <ClipboardDocumentCheckIcon
                    className="w-5 h-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <select
                  name="status"
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(+e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 outline-none"
                >
                  <option value={StatusType.PENDIENTE}>Pendiente</option>
                  <option value={StatusType.COMPLETADO}>Completado</option>
                  <option value={StatusType.CANCELADO}>Cancelado</option>
                  <option value={StatusType.RECHAZADO}>Rechazado</option>
                </select>
              </div>
            </div>
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
                  value={data.counseling?.id}
                  disabled
                  id="group"
                  className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 outline-none"
                >
                  <option value={data.counseling?.id}>
                    {data.counseling?.group.subjectName}
                  </option>
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
                  value={data.counseling?.group.name}
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
                  value={format(selectedTime, 'HH:mm')}
                  onChange={(e) => {
                    const [hoursString, minutesString] =
                      e.target.value.split(':');
                    const date = new Date(Date.now());
                    const hours = Number(hoursString);
                    const minutes = Number(minutesString);

                    if (isNaN(hours) || isNaN(minutes)) return;

                    date.setHours(Number(hours));
                    date.setMinutes(Number(minutes));
                    setSelectedTime(date);
                  }}
                  className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <button
              type="submit"
              className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md bg-primary/80 hover:bg-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              Actualizar
            </button>
          </div>
        </div>
      </Form>
    </>
  );
}
