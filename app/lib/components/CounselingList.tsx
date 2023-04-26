import {
  MagnifyingGlassPlusIcon,
  PencilIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import { Dialog, Transition } from "@headlessui/react";
import {
  ClipboardDocumentListIcon,
  ClockIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { Fragment, useState } from "react";

interface Counseling {
  id: string;
  time: string;
  subject: string;
  group: string;
  description: string;
  status: Status;
  date: string;
}

interface Status {
  aceptado?: boolean;
  rechazado?: boolean;
  pendiente?: boolean;
}

// TEMP
const counselings: Counseling[] = [
  {
    id: "1",
    time: "10:00",
    subject: "Matematicas Fundamentales",
    group: "1A",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    status: {
      aceptado: true,
    },
    date: "2021-12-27",
  },
  {
    id: "2",
    time: "10:30",
    subject: "Física 2",
    group: "13A",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    status: {
      pendiente: true,
    },
    date: "2021-12-27",
  },
  {
    id: "3",
    time: "13:00",
    subject: "Investigación de Operaciones",
    group: "1A",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    status: {
      rechazado: true,
    },
    date: "2021-12-27",
  },
];

interface Props {
  canCreate?: boolean;
}
export default function CounselingList({ canCreate = false }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isReason, setIsReason] = useState(false);
  const [currentCounseling, setCurrentCounseling] = useState<Counseling | null>(
    null
  );

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  function openReason() {
    setIsReason(true);
  }
  function closeReason() {
    setIsReason(false);
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

      {/* MODAL */}
      {canCreate && (
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={closeModal}>
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
                      Nueva Asesoría
                    </Dialog.Title>
                    <div className="mt-2">
                      {/* FORM */}
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
                          htmlFor="subject"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Asignatura
                        </label>
                        <div className="relative mt-2 rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <ClipboardDocumentListIcon
                              className="w-5 h-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </div>
                          <input
                            type="subject"
                            name="subject"
                            id="subject"
                            className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 outline-none"
                            placeholder="Ingeniería de Software"
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="group"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Grupo
                        </label>
                        <div className="relative mt-2 rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <UserGroupIcon
                              className="w-5 h-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </div>
                          <input
                            type="group"
                            name="group"
                            id="group"
                            className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 outline-none"
                            placeholder="1"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <button
                        type="button"
                        className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md bg-primary/80 hover:bg-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={closeModal}
                      >
                        Crear
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      )}
      <div className="px-4 pt-20 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold leading-6 text-gray-900">
              Asesorías
            </h1>
          </div>
          <div
            className={`mt-4 sm:ml-16 sm:mt-0 sm:flex-none ${
              canCreate ? "" : "hidden"
            }`}
          >
            <button
              type="button"
              onClick={openModal}
              className="block px-3 py-2 text-sm font-semibold text-center text-white rounded-md shadow-sm bg-primary hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Agregar asesoría
            </button>
          </div>
        </div>
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
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-0"
                    >
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {counselings.map((c) => (
                    <tr key={c.id}>
                      <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-0">
                        {c.time}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {c.subject}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {c.group}
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
                        {/* {c.status} */}
                        Activo
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {c.date}
                      </td>
                      <td className="relative py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-0">
                        <a
                          href="#"
                          className="text-primary/80 hover:text-primary"
                        >
                          <PencilIcon className="w-5 h-5" />
                          <span className="sr-only">, {c.id}</span>
                        </a>
                      </td>
                      <td className="relative py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-0">
                        <a
                          href="#"
                          className="text-primary/80 hover:text-primary"
                        >
                          <XCircleIcon className="w-7 h-7" />
                          <span className="sr-only">, {c.id}</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
