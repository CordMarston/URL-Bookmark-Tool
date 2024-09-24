import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { prisma } from "~/services/prisma.server";
import { getClientIPAddress } from "remix-utils/get-client-ip-address";
import { UAParser } from 'ua-parser-js';

export async function loader({request, params}:LoaderFunctionArgs) {
    let userAgent = request.headers.get("user-agent")?.toString();
    let ipAddress = getClientIPAddress(request);
    const { browser, cpu, device, os,  } = UAParser(userAgent);
    let alias = params.alias;
    const link = await prisma.link.findFirst({
        where: {
            alias: alias
        }
    })
    
    if(link && link.link) {
        const visit = await prisma.linkVisit.create({
            data: {
                linkId: link.id,
                ipAddress: ipAddress?.toString(),
                osName: os.name,
                osVersion: os.version,
                browserName: browser.name,
                browserVersion: browser.version,

            }
        })
        
        return redirect(link.link);
    } else {
        throw new Response(null, {
            status: 404,
            statusText: "Not Found",
        });
    }
}