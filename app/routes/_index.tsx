import { getUser, requireUser } from "~/lib/utils/session.server";

import CounselingList from "~/lib/components/CounselingList";
import Navbar from "~/lib/components/Navbar";
import { LoaderArgs, redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/lib/utils/db.server";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

// TEMPORAL
const days = [
  { date: "2021-12-27" },
  { date: "2021-12-28" },
  { date: "2021-12-29" },
  { date: "2021-12-30" },
  { date: "2021-12-31" },
  { date: "2022-01-01", isCurrentMonth: true },
  { date: "2022-01-02", isCurrentMonth: true },
  { date: "2022-01-03", isCurrentMonth: true },
  { date: "2022-01-04", isCurrentMonth: true },
  { date: "2022-01-05", isCurrentMonth: true },
  { date: "2022-01-06", isCurrentMonth: true },
  { date: "2022-01-07", isCurrentMonth: true },
  { date: "2022-01-08", isCurrentMonth: true },
  { date: "2022-01-09", isCurrentMonth: true },
  { date: "2022-01-10", isCurrentMonth: true },
  { date: "2022-01-11", isCurrentMonth: true },
  { date: "2022-01-12", isCurrentMonth: true, isToday: true },
  { date: "2022-01-13", isCurrentMonth: true },
  { date: "2022-01-14", isCurrentMonth: true },
  { date: "2022-01-15", isCurrentMonth: true },
  { date: "2022-01-16", isCurrentMonth: true },
  { date: "2022-01-17", isCurrentMonth: true },
  { date: "2022-01-18", isCurrentMonth: true },
  { date: "2022-01-19", isCurrentMonth: true },
  { date: "2022-01-20", isCurrentMonth: true },
  { date: "2022-01-21", isCurrentMonth: true },
  { date: "2022-01-22", isCurrentMonth: true, isSelected: true },
  { date: "2022-01-23", isCurrentMonth: true },
  { date: "2022-01-24", isCurrentMonth: true },
  { date: "2022-01-25", isCurrentMonth: true },
  { date: "2022-01-26", isCurrentMonth: true },
  { date: "2022-01-27", isCurrentMonth: true },
  { date: "2022-01-28", isCurrentMonth: true },
  { date: "2022-01-29", isCurrentMonth: true },
  { date: "2022-01-30", isCurrentMonth: true },
  { date: "2022-01-31", isCurrentMonth: true },
  { date: "2022-02-01" },
  { date: "2022-02-02" },
  { date: "2022-02-03" },
  { date: "2022-02-04" },
  { date: "2022-02-05" },
  { date: "2022-02-06" },
];

export const loader = async ({ request }: LoaderArgs) => {
  await requireUser(request);
  const user = await getUser(request);

  // groups that the user is in
  const groups = await db.group.findMany({
    where: {
      users: {
        some: {
          id: user?.id,
        },
      },
    },
  });

  if (user?.isTeacher) return redirect("/teacher");

  // teachers that are in the same groups as the user
  const teachers = await db.user.findMany({
    where: {
      isTeacher: true,
      groups: {
        some: {
          id: {
            in: groups.map((group) => group.id),
          },
        },
      },
    },
    select: {
      id: true,
      name: true,
    },
  });

  const counselings = await db.counseling.findMany({
    where: {
      teacherId: {
        in: teachers.map((teacher) => teacher.id),
      },
      studentId: user?.id,
    },
    select: {
      id: true,
      teacher: {
        select: {
          id: true,
          name: true,
        },
      },
      student: {
        select: {
          id: true,
          name: true,
        },
      },
      date: true,
      description: true,
    },
  });

  console.log(counselings);

  return json({
    user,
    teachers,
    counselings,
  });
};

export default function Index() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <div className="fixed top-0 left-0 w-screen">
        <Navbar name={data.user!.name} />
      </div>
      <main className="grid grid-cols-12">
        {/* SIDEBAR */}
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
              {data.teachers.map((teacher) => (
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
          <div>
            <div className="mt-6">
              <h2 className="text-center">March</h2>
            </div>
            <div className="grid grid-cols-7 mt-2 text-xs leading-6 text-gray-500">
              <div className="flex justify-center">M</div>
              <div className="flex justify-center">T</div>
              <div className="flex justify-center">W</div>
              <div className="flex justify-center">T</div>
              <div className="flex justify-center">F</div>
              <div className="flex justify-center">S</div>
              <div className="flex justify-center">S</div>
            </div>
            <div className="grid grid-cols-7 gap-px mt-2 text-sm">
              {days.map((day, dayIdx) => (
                <button
                  key={day.date}
                  type="button"
                  className={classNames("py-1.5 hover:bg-gray-100 focus:z-10")}
                >
                  <time
                    dateTime={day.date}
                    className={classNames(
                      "mx-auto flex h-7 w-7 items-center justify-center rounded-full"
                      // day.isSelected && day.isToday && "bg-primary",
                      // day.isSelected && !day.isToday && "bg-gray-900"
                    )}
                  >
                    {/* {day.date.split("-").pop().replace(/^0/, "")} */}
                    {day.date.split("-").pop()}
                  </time>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="h-screen max-h-screen col-span-9 p-8">
          {/* LISTA */}
          <CounselingList canCreate />
        </div>
      </main>
    </>
  );
}
