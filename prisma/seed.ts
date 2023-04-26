import type { Group } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { StatusType } from "~/lib/utils/types";

const prisma = new PrismaClient();

// Create users, subjects and groups
async function seed() {
  const groups: Group[] = [];

  // create subjects
  const tempSubjects = getSubjects();
  for (const subject of tempSubjects) {
    await prisma.subject.create({
      data: subject,
    });
  }

  // create groups
  const tempGroups = getGroups();
  for (const group of tempGroups) {
    const g = await prisma.group.create({
      data: group,
    });
    groups.push(g);
  }

  // create user with student role and groups
  const svarona = await prisma.user.create({
    data: {
      email: "svarona@email.com",
      name: "Sebastian Varona",
      password: {
        create: {
          hash: await bcrypt.hash("svarona", 10),
        },
      },
      groups: {
        connect: [
          // Inge 2 1B
          {
            id: groups.find((group) => group.name === "1B")!.id,
          },
          // Bases 2 1C
          {
            id: groups.find((group) => group.name === "1C")!.id,
          },
        ],
      },
    },
  });

  // create user with teacher role and groups
  const asolano = await prisma.user.create({
    data: {
      email: "asolano@edu.co",
      name: "Andres Solano",
      password: {
        create: {
          hash: await bcrypt.hash("asolano", 10),
        },
      },
      isTeacher: true,
      groups: {
        connect: [
          // Inge 1 2A
          {
            id: groups.find((group) => group.name === "2A")!.id,
          },
          // Inge 2 1B
          {
            id: groups.find((group) => group.name === "1B")!.id,
          },
        ],
      },
    },
  });
  const ccruz = await prisma.user.create({
    data: {
      email: "ccruz@edu.co",
      name: "Carlos Cruz",
      password: {
        create: {
          hash: await bcrypt.hash("ccruz", 10),
        },
      },
      isTeacher: true,
      groups: {
        connect: [
          // Bases 2 1C
          {
            id: groups.find((group) => group.name === "1C")!.id,
          },
        ],
      },
    },
  });

  await prisma.counseling.create({
    data: {
      status: StatusType.PENDIENTE,
      date: new Date(),
      description: "Necesito ayuda con el proyecto de la materia",
      student: {
        connect: {
          id: svarona.id,
        },
      },
      teacher: {
        connect: {
          id: asolano.id,
        },
      },
      group: {
        connect: {
          id: groups.find((group) => group.name === "1B")!.id,
        },
      },
    },
  });

  await prisma.counseling.create({
    data: {
      status: StatusType.ACEPTADO,
      date: new Date(),
      description: "No entiendo el tema de las relaciones",
      student: {
        connect: {
          id: svarona.id,
        },
      },
      teacher: {
        connect: {
          id: ccruz.id,
        },
      },
      group: {
        connect: {
          id: groups.find((group) => group.name === "1C")!.id,
        },
      },
    },
  });

  console.log(`Database has been seeded. 🌱`);
}

seed();

function getSubjects() {
  return [
    {
      name: "Ingeniería de Software 1",
    },
    {
      name: "Ingeniería de Software 2",
    },
    {
      name: "Bases de Datos 1",
    },
    {
      name: "Bases de Datos 2",
    },
    {
      name: "Estructuras de Datos",
    },
  ];
}

function getGroups() {
  return [
    {
      name: "1A",
      subject: {
        connect: {
          name: "Ingeniería de Software 1",
        },
      },
    },
    {
      name: "2A",
      subject: {
        connect: {
          name: "Ingeniería de Software 1",
        },
      },
    },
    {
      name: "1B",
      subject: {
        connect: {
          name: "Ingeniería de Software 2",
        },
      },
    },
    {
      name: "1C",
      subject: {
        connect: {
          name: "Bases de Datos 2",
        },
      },
    },
  ];
}
