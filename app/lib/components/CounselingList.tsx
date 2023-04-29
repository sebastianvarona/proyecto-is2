import {
  MagnifyingGlassPlusIcon,
  PencilIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import { Dialog, Transition } from "@headlessui/react";

import { Fragment, useState } from "react";
import { format } from "date-fns";
import { Form, Link } from "@remix-run/react";
import StatusTile from "./Status";
import { es } from "date-fns/locale";
import { StatusType } from "../utils/types";

export interface Counseling {
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

interface Props {
  canCreate?: boolean;
  data: any;
}
export default function CounselingList({ data }: Props) {
  const [isReason, setIsReason] = useState(false);
  const [currentCounseling, setCurrentCounseling] = useState<Counseling>(
    data.counselings[0]
  );

  function openReason() {
    setIsReason(true);
  }
  function closeReason() {
    setIsReason(false);
  }

  function formatDate(date: Date) {
    const d = new Date(date);
    const formattedDate = format(d, "PPP", {
      locale: es,
    });
    return formattedDate;
  }

  function getTime(date: Date) {
    const d = new Date(date);
    const time = format(d, "HH:mm");
    return time;
  }

  return (
    <>
      {/* REASON MODAL */}
      {isReason && (
        <Transition appear show={isReason} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={closeReason}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex items-center justify-center min-h-full p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Razón
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {currentCounseling?.description || "No hay razón"}
                      </p>
                    </div>

                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={closeReason}
                        className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md bg-primary/80 hover:bg-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                      >
                        Aceptar
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      )}

      <div className="flow-root mt-8">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    Hora
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Asignatura
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Grupo
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Razon
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Estado
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Fecha
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-normal text-gray-900"
                  >
                    Editar
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-normal text-gray-900"
                  >
                    Cancelar
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.counselings.map((c: Counseling) => (
                  <tr key={c.id}>
                    <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-0">
                      {getTime(c.date)}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {c.group.subjectName}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {c.group.name}
                    </td>
                    <td
                      onClick={() => {
                        setCurrentCounseling(c);
                        openReason();
                      }}
                      className="px-3 py-4 text-sm text-gray-500 cursor-pointer whitespace-nowrap"
                    >
                      <MagnifyingGlassPlusIcon className="w-5 h-5" />
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                      <StatusTile status={c.status} />
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {formatDate(c.date)}
                    </td>
                    <td
                      className={`relative py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-0 ${
                        c.status == StatusType.CANCELADO ||
                        c.status == StatusType.RECHAZADO
                          ? "hidden"
                          : ""
                      }`}
                    >
                      <Link
                        to={`/student/${c.id}`}
                        className="text-primary/80 hover:text-primary"
                      >
                        <PencilIcon className="w-5 h-5" />
                        <span className="sr-only">, {c.id}</span>
                      </Link>
                    </td>
                    <td
                      className={`relative py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-0 ${
                        c.status == StatusType.CANCELADO ||
                        c.status == StatusType.RECHAZADO
                          ? "hidden"
                          : ""
                      }`}
                    >
                      <Form
                        method="DELETE"
                        action={`/student/${c.id}`}
                        className="flex text-primary/80 hover:text-primary"
                      >
                        <button type="submit">
                          <XCircleIcon className="w-7 h-7" />
                          <span className="sr-only">, {c.id}</span>
                        </button>
                      </Form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
