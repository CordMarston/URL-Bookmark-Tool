import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { prisma } from "~/services/prisma.server";
export async function loader({request, params}:LoaderFunctionArgs) {
    let alias = params.alias;
    const link = await prisma.link.findFirst({
        where: {
            alias: alias
        }
    })
    if(link && link.link) {
        return redirect(link.link);
    } else {
        throw new Response(null, {
            status: 404,
            statusText: "Not Found",
        });
    }
}