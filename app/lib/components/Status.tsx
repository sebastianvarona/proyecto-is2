import { StatusType } from "../utils/types";

export default function StatusTile({ status }: { status: number }) {
  return (
    <div
      className={`rounded-full py-1 flex gap-2 items-center justify-center ${getBgColor(
        status
      )}`}
    >
      <div className={`w-2 h-2 rounded-full ${getColor(status)}`} />
      <span className="text-xs font-semibold text-gray-900">
        {getText(status)}
      </span>
    </div>
  );
}

function getText(status: number) {
  switch (status) {
    case StatusType.ACEPTADO:
      return "Aceptado";
    case StatusType.PENDIENTE:
      return "Pendiente";
    case StatusType.RECHAZADO:
      return "Rechazado";
    case StatusType.CANCELADO:
      return "Cancelado";
    default:
      return "Desconocido";
  }
}

function getColor(status: number) {
  switch (status) {
    case StatusType.ACEPTADO:
      return "bg-green-500";
    case StatusType.PENDIENTE:
      return "bg-yellow-500";
    case StatusType.RECHAZADO:
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
}
function getBgColor(status: number) {
  switch (status) {
    case StatusType.ACEPTADO:
      return "bg-green-500/10";
    case StatusType.PENDIENTE:
      return "bg-yellow-500/10";
    case StatusType.RECHAZADO:
      return "bg-red-500/10";
    default:
      return "bg-gray-500/10";
  }
}
