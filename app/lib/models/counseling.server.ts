import { db } from '../utils/db.server';
import { StatusType } from '../utils/types';

export async function getCounselingsFromStudent(
  studentId: string,
  month: number,
  year: number,
  teacherId?: string
) {
  const counselings = await db.counseling.findMany({
    where: {
      studentId: studentId,
      teacherId: {
        contains: teacherId,
      },
      date: {
        gte: new Date(year, month, 1),
        lt: new Date(year, month + 1, 1),
      },
    },
    select: {
      id: true,
      date: true,
      description: true,
      status: true,
      teacher: {
        select: {
          id: true,
          name: true,
        },
      },
      group: {
        select: {
          id: true,
          name: true,
          subjectName: true,
        },
      },
    },
    orderBy: [
      {
        status: 'asc',
      },
      {
        date: 'asc',
      },
    ],
  });
  return counselings;
}

export async function getCounselingsFromTeacher(
  teacherId: string,
  month: number,
  year: number
) {
  const counselings = await db.counseling.findMany({
    where: {
      teacherId: teacherId,
      date: {
        gte: new Date(year, month, 1),
        lt: new Date(year, month + 1, 1),
      },
    },
    select: {
      id: true,
      date: true,
      description: true,
      status: true,
      student: {
        select: {
          id: true,
          name: true,
        },
      },
      group: {
        select: {
          id: true,
          name: true,
          subjectName: true,
        },
      },
    },
    orderBy: [
      {
        status: 'asc',
      },
      {
        date: 'asc',
      },
    ],
  });
  return counselings;
}

export async function getCounseling(id: string) {
  const counseling = await db.counseling.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      date: true,
      description: true,
      status: true,
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
      group: {
        select: {
          id: true,
          name: true,
          subjectName: true,
        },
      },
    },
  });
  return counseling;
}

export async function deleteCounseling(id: string) {
  const counseling = await db.counseling.update({
    where: {
      id: id,
    },
    data: {
      status: StatusType.CANCELADO,
    },
  });
  return counseling;
}

export async function createCounseling({
  date,
  description,
  status,
  teacherId,
  studentId,
  groupId,
}: {
  date: Date;
  description: string;
  status: number;
  teacherId: string;
  studentId: string;
  groupId: string;
}) {
  try {
    const counseling = await db.counseling.create({
      data: {
        date: date,
        description: description,
        status: status,
        teacherId: teacherId,
        studentId: studentId,
        groupId: groupId,
      },
    });

    return counseling;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateCounselingAsStudent({
  id,
  description,
  datetime,
}: {
  id: string;
  description: string;
  datetime: Date;
}) {
  const counseling = await db.counseling.update({
    where: {
      id: id,
    },
    data: {
      description: description,
      date: datetime,
    },
  });
  return counseling;
}

export async function updateCounselingAsTeacher({
  id,
  status,
  datetime,
}: {
  id: string;
  status: number;
  datetime: Date;
}) {
  const counseling = await db.counseling.update({
    where: {
      id: id,
    },
    data: {
      status,
      date: datetime,
    },
  });
  return counseling;
}
