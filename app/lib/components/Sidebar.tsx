import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import type { User } from '@prisma/client';
import { Link } from '@remix-run/react';
import { format } from 'date-fns';
import es from 'date-fns/locale/es';
import { useState } from 'react';
import { DayPicker } from 'react-day-picker';

function formatMonthTitle(date: Date) {
  return format(date, 'MMMM yyyy', { locale: es });
}

export default function Sidebar({
  teachers,
  activeMonth,
}: {
  teachers: User[];
  activeMonth: Date;
}) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(Date.now()));

  return (
    <div className="flex flex-col h-screen max-h-screen min-h-screen col-span-3 p-8 bg-gray-200 pt-28">
      {/* BUSCADOR */}
      <div className="mb-6">
        <label
          htmlFor="email"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Buscar profesor
        </label>
        <div className="mt-2">
          <input
            type="text"
            name="search"
            id="search"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
            placeholder="Pepito Perez"
          />
        </div>
      </div>
      {/* CONTENIDO */}
      <div className="flex-1 overflow-y-scroll">
        <ul className="flex flex-col gap-3 py-2 pl-0.5 pr-4">
          {teachers.map((teacher: User) => (
            <li
              key={teacher.id}
              className="px-3 py-1 font-medium rounded-md bg-white/50 outline outline-gray-300"
            >
              {teacher.name}
            </li>
          ))}
        </ul>
      </div>
      {/* CALENDARIO */}
      <div className="flex items-center justify-between h-32 p-8 mt-8 -mx-8 -mb-8 border border-t-gray-300">
        <Link
          to={`/student?monthYear=${format(
            new Date(activeMonth.getFullYear(), activeMonth.getMonth() - 1),
            'MM-yyyy'
          )}`}
          className="text-primary"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </Link>
        <h1 className="text-3xl font-medium capitalize text-primary">
          {formatMonthTitle(activeMonth)}
        </h1>
        <Link
          to={`/student?monthYear=${format(
            new Date(activeMonth.getFullYear(), activeMonth.getMonth() + 1),
            'MM-yyyy'
          )}`}
          className="text-primary"
        >
          <ChevronRightIcon className="w-6 h-6" />
        </Link>
      </div>
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
    </div>
  );
}
