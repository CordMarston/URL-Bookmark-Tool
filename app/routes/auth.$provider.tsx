import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { authenticator } from "../services/auth.server";
export async function loader() {
  return redirect("/login");
}

export async function action({ request, params }:ActionFunctionArgs) {
  return await authenticator.authenticate(params.provider as string, request);
}