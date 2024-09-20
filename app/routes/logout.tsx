import { authenticator } from "../services/auth.server";
import { ActionFunction, redirect } from "@remix-run/node";

export async function loader({request}:any) {
  await authenticator.logout(request, { redirectTo: "/login" });
  return redirect("/login");
}

export const action: ActionFunction = async ({ request }) => {
  await authenticator.logout(request, { redirectTo: "/login" });
};