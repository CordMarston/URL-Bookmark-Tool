
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
      }
    })
  } else {
    return null;
  }
};

export default function DashboardPage() {
  const data: LinkType[] = useLoaderData();
  const [copied, setCopied] = useState(0)
  let links = data.map(function(link) {
    return (
      <div className="flex flex-col" key={link.id}>
        <div className="flex">
          <input type="text" name="link" className={"bg-gray-600 text-white p-6 text-xl block w-full shadow-sm rounded-s-md text-sm focus:z-10 focus:border-violet-500 focus:ring-violet-500 disabled:opacity-50 disabled:pointer-events-none "} value={`https://url.cordmarston.com/l/`+link?.alias } readOnly/>
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
        <div className="bg-gray-800 text-xs rounded-b -mt-2 p-2 px-6">
          <span className="font-bold">Redirects To:</span> { link.link }
        </div>
      </div>
    )
  })
  return (
    <>
      <header className="flex flex-col items-center">
        <h2 className="text-6xl text-gray-800 dark:text-gray-100">
          My <span className="text-violet-600 font-extrabold">Link</span> Bookmarks
        </h2>
      </header>
      <div className="flex justify-end w-full max-w-7xl text-right">
        <Link to="/"><div className="bg-violet-600 text-white p-4 rounded">+ Create Link</div></Link>
      </div>
      <div className="mt-4 my-8 w-full max-w-7xl text-gray-100 bg-gray-700 p-8 flex flex-col gap-y-4 rounded">
      { links }
      </div>
    </>
  );
}