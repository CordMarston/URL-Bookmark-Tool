import { Link as LinkType, LinkVisit, User } from "@prisma/client";
import { LoaderFunction, LoaderFunctionArgs, MetaFunction, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { authenticator } from "~/services/auth.server";
import { prisma } from "~/services/prisma.server";

export const meta: MetaFunction = () => {
    return [
      { title: "URL Bookmarker - Analytics" },
      { name: "description", content: "Bookmark links to send to mobile." },
    ];
};

type LoaderData = {
    linkId: string,
    link: LinkType,
    visits: Array<LinkVisit>,
    uniqueVisits: any,
    totalVisits: any,
    page: number,
    totalPages: number
}

export let loader: LoaderFunction = async ({ request, params}:LoaderFunctionArgs) => {
    const user:User = await authenticator.isAuthenticated(request, {
      failureRedirect: "/login",
    });

    let linkId:string | undefined = params.id;
    let page:number = (params.page ? parseInt(params.page) : 1);
    let pageSize:number = 10;
    let skip:number = (+page * +pageSize)- +pageSize;
    if(user && linkId) {
      let link = await prisma.link.findUnique({
        where: {
            id: parseInt(linkId),
            userId: user.id
        }
      });

      if(!link) {
        return redirect('/login');
      } else {
        let visits = await prisma.linkVisit.findMany({
            skip: skip,
            take: pageSize,
            where: {
                linkId: parseInt(linkId)
            }
        });        

        let uniqueVisits = await prisma.linkVisit.groupBy({
            by: ['ipAddress'],
            where: {
                linkId: parseInt(linkId)
            }
        });

        let totalVisits = await prisma.linkVisit.count({
            where: {
                linkId: parseInt(linkId)
            }
        });

        let totalPages = Math.ceil(totalVisits / pageSize);

        let loaderData:LoaderData = {
            linkId: linkId,
            link: link,
            visits: visits,
            uniqueVisits: uniqueVisits,
            totalVisits: totalVisits,
            page: page,
            totalPages: totalPages
        };
        return loaderData;
      }
    } 
  };
  
export default function Analytics() {
    const data: LoaderData = useLoaderData<typeof loader>();
    let visits = data.visits.map(function(visit) {
        return (
            <tr key={visit.id}>
                <td className="p-4">{visit.ipAddress}</td>
                <td className="p-4">{visit.osName}</td>
                <td className="p-4">{visit.osVersion}</td>
                <td className="p-4">{visit.browserName}</td>
                <td className="p-4">{visit.browserVersion}</td>
                <td className="p-4">{visit.createdAt.toString()}</td>
            </tr>
        )
    })
    return (
        <>
         <header className="flex flex-col items-center p-4 md:p-0">
            <h2 className="text-6xl text-gray-800 dark:text-gray-100">
                Link <span className="text-violet-600 font-extrabold">Analytics</span>
            </h2>
        </header>
        <div className="grid grid-cols-2 gap-4 w-full max-w-7xl text-white py-8">
            <div className="bg-gray-800 rounded p-4">
                <div className="text-xl">Total Hits</div>
                <div className="text-8xl">{ data.totalVisits }</div>
            </div>
            <div className="bg-gray-800 rounded p-4">
                <div className="text-xl">Unique Hits</div>
                <div className="text-7xl">{ data.uniqueVisits.length }</div>
            </div>
        </div>
        <table className="w-full max-w-7xl">
            <thead className="bg-gray-800 text-white">
                <tr>
                    <th className="p-4 text-left">IP Address</th>
                    <th className="p-4 text-left">OS</th>
                    <th className="p-4 text-left">OS Version</th>
                    <th className="p-4 text-left">Browser</th>
                    <th className="p-4 text-left">Browser Version</th>
                    <th className="p-4 text-left">Visit Date</th>
                </tr>
            </thead>
            <tbody className="text-white">
                 { visits }
            </tbody>
            <tfoot>
                <tr>
                    <td className="py-4 text-right" colSpan={6}>
                        { data.page > 1 ? <Link to={'/analytics/'+data.linkId+'/'+(+data.page-1)} className="bg-violet-600 text-white p-4 rounded text-center w-6 mr-1">&#8249;</Link> : ''}
                        { data.totalPages > data.page ? <Link to={'/analytics/'+data.linkId+'/'+(+data.page+1)} className="bg-violet-600 text-white p-4 rounded text-center w-6">&#8250;</Link> : ''}
                    </td>
                </tr>
            </tfoot>
        </table>
      </>
       
    )
}