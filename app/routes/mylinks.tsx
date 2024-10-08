
import { User, Link as LinkType } from "@prisma/client";
import { ActionFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { authenticator } from "~/services/auth.server";
import { prisma } from "~/services/prisma.server";

export const meta: MetaFunction = () => {
  return [
    { title: "URL Bookmarker - My Links" },
    { name: "description", content: "Bookmark links to send to mobile." },
  ];
};

export let loader: LoaderFunction = async ({ request }) => {
  const user:User = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });


  if(user) {
    return await prisma.link.findMany({
      where: {
        userId: user.id
      },
      orderBy: [
        {
          id: 'desc',
        },
      ],
    })
  } else {
    return null;
  }
};

function NoLinks() {
  return (
    <div className="w-full text-center">
      It looks like you haven't bookmarked a link. <Link to="/"><div className="bg-violet-600 text-white p-4 rounded inline">Create a link bookmark</div></Link> to get started.
    </div>
  )
}

export default function MyLinks() {
  const data: LinkType[] = useLoaderData();
  const [copied, setCopied] = useState(0)
  let links = data.map(function(link) {
    return (
      <div className="flex flex-col" key={link.id}>
        <div className="flex">
          <input type="text" name="link" className={"bg-gray-600 text-white p-6 text-xl block w-full shadow-sm rounded-s-md text-sm focus:z-10 focus:border-violet-500 focus:ring-violet-500 disabled:opacity-50 disabled:pointer-events-none "} value={`https://url.cordmarston.com/l/`+link?.alias } readOnly/>
          <Link to={"/analytics/"+link.id} className="p-6 shrink-0 inline-flex justify-center items-center gap-x-2 text-sm font-semibold border border-transparent bg-sky-600 text-white focus:outline-none focus:bg-sky-700">Analytics</Link>
          {copied !== link.id ? 
            <button onClick={() => {navigator.clipboard.writeText(`https://url.cordmarston.com/l/`+link?.alias); setCopied(link.id)}} className="p-6 shrink-0 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-e-md border border-transparent bg-violet-700 text-white focus:outline-none focus:bg-violet-700">
              Copy
            </button>
          :
            <button onClick={() => {navigator.clipboard.writeText(`https://url.cordmarston.com/l/`+link?.alias)}} className="p-6 shrink-0 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-e-md border border-transparent bg-violet-700 text-white focus:outline-none focus:bg-violet-700">
              &#10003; Copied
            </button>
          }
        </div>
        <div className="bg-gray-700 text-xs rounded-b -mt-2 p-2 px-6 truncate">
          <span className="font-bold">Redirects To:</span> { link.link}
        </div>
      </div>
    )
  })


  return (
    <>
      <header className="flex flex-col items-center p-4 md:p-0">
        <h2 className="text-6xl text-gray-800 dark:text-gray-100">
          My <span className="text-violet-600 font-extrabold">Link</span> Bookmarks
        </h2>
      </header>
      { data.length > 0 && <div className="grid p-4 md:p-0 justify-stretch md:justify-end w-full max-w-7xl text-center md:text-right">
        <Link to="/"><div className="bg-violet-600 text-white p-4 rounded">+ Create Link</div></Link>
      </div>
      }
      <div className="mt-4 my-8 w-full max-w-7xl text-gray-100 py-4 flex flex-col gap-y-4 rounded">
        { data.length > 0 ? links : <NoLinks/> }
      </div>
    </>
  );
}