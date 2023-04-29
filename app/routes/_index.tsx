import { requireUser } from "~/lib/utils/session.server";

import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

export const loader = async ({ request }: LoaderArgs) => {
  const user = await requireUser(request);

  if (user.isTeacher) {
    return redirect("/teacher");
  } else {
    return redirect("/student");
  }
};
