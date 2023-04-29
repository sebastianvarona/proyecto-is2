import { db } from "../utils/db.server";

export async function getGroupsFromUser(userId: string) {
  const groups = await db.group.findMany({
    where: {
      users: {
        some: {
          id: userId,
        },
      },
    },
    select: {
      id: true,
      name: true,
      subjectName: true,
    },
  });
  return groups;
}
