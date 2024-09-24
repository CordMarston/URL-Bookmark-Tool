import { ActionFunctionArgs } from "@remix-run/node";
import { authenticator } from "../services/auth.server";
export async function loader({ request, params }:ActionFunctionArgs) {
    return await authenticator.authenticate(params.provider as string, request, {
      successRedirect: "/mylinks",
    })
}