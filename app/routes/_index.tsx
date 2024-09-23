import type { ActionFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import { Form, json, Link, useActionData, useLoaderData } from "@remix-run/react";
import { prisma } from '../services/prisma.server';
import { useState } from "react";
import { authenticator } from "~/services/auth.server";
import { User } from '@prisma/client'

export const meta: MetaFunction = () => {
  return [
    { title: "URL Bookmarker" },
    { name: "description", content: "Bookmark links to send to mobile." },
  ];
};

export let loader: LoaderFunction = async ({ request }) => {
  return await authenticator.isAuthenticated(request);
};

type ActionData = {
  errors?: { 
    link?: string, 
    alias?: string 
  }, 
  data?: { 
    link: string,
    alias: string
  }
}

type LoaderData = {
  id: string | null
}

const isValidUrl = (url: string) => {
  var urlPattern = new RegExp('^(https?:\\/\\/)?'+ 
                    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ 
                    '((\\d{1,3}\\.){3}\\d{1,3}))'+ 
                    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+
                    '(\\?[;&a-z\\d%_.~+=-]*)?'+ 
                    '(\\#[-a-z\\d_]*)?$','i');
  return !!urlPattern.test(url);
}

export const action: ActionFunction = async ({ request }) => {
  const user:User = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const formData = await request.formData();
  const link = formData.get('link');
  const alias = formData.get('alias');

  if (typeof link !== 'string' || link.length === 0) {
    return json({ errors: { link: 'Link is required' } }, { status: 422 });
  }

  if (!isValidUrl(link)) {
    return json({ errors: { link: 'Invalid URL' } }, { status: 406 });
  }

  if(alias && typeof alias == 'string') {
    // Alias entered check it's unique and create link
    const checkLink = await prisma.link.findUnique({
      where: {
        alias: alias
      }
    })
    if(checkLink) {
      return json({ errors: { alias: 'Alias already used'}}, {status: 406});
    } else {

      const newLink = await prisma.link.create({
        data: {
          link: link,
          alias: alias,
          userId: (user && user.id ? user.id : null)
        }
      })
      
      if(newLink) {
        return json({ data: newLink }, {status: 201});
      }
    }
  } else {
    // No alias entered, generate one
    let unique = false;
    let randomAlias = (Math.random() + 1).toString(36).substring(7);
    while(!unique) {
      let checkLink = await prisma.link.findFirst({
        where: {
          alias: randomAlias as string
        }
      });
      if(!checkLink) {
        unique = true;
      } else {
        randomAlias = (Math.random() + 1).toString(36).substring(7);
      }
    }
    const newLink = await prisma.link.create({
      data: {
        link: link,
        alias: randomAlias
      }
    })
    if(newLink) {
      return json({ data: newLink }, {status: 201});
    }
  }

  return true;
};

function UrlForm({ errors }: ActionData) {
  return (
    <Form method="post" className="my-8 w-full max-w-7xl text-gray-100 rounded bg-gray-700 p-8">
      <div  className="m-2">
        <label>Full URL</label>
        {errors?.link && <label className="float-right text-red-600">{errors?.link}</label>}
      </div>
      <input type="text" name="link" className={"bg-gray-600 text-white p-6 text-xl block w-full shadow-sm rounded-md text-sm focus:z-10 focus:border-violet-500 focus:ring-violet-500 disabled:opacity-50 disabled:pointer-events-none " + (errors?.link && 'border border-red-600')} placeholder="https://link.com"/>
      <div  className="m-2 mt-4">
        <label>Bookmark URL (Optional)</label>
        {errors?.alias && <label className="float-right text-red-600">{errors?.alias}</label>}
      </div>
      <div className="flex">
        <div className="p-6 shrink-0 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-s-md border border-transparent bg-gray-800 text-white focus:outline-none focus:bg-violet-700">
          https://url.cordmarston.com/
        </div>
        <input type="text" name="alias" className={"bg-gray-600 text-white p-6 text-xl block w-full shadow-sm rounded-e-md text-sm focus:z-10 focus:border-violet-500 focus:ring-violet-500 disabled:opacity-50 disabled:pointer-events-none " + (errors?.alias && 'border border-red-600')} placeholder="custom-alias"/>
      </div>
      <button type="submit" className="mt-8 w-full p-6 shrink-0 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-md border border-transparent bg-violet-600 text-white hover:bg-violet-400 focus:outline-none focus:bg-violet-700 disabled:opacity-50 disabled:pointer-events-none">
        Bookmark
      </button>
    </Form>
  )
}

function UrlBookmark({ data }: ActionData) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="my-8 w-full max-w-7xl text-gray-100  bg-gray-700 p-8">
      <div className="flex">
        <input type="text" name="link" className={"bg-gray-600 text-white p-6 text-xl block w-full shadow-sm rounded-s-md text-sm focus:z-10 focus:border-violet-500 focus:ring-violet-500 disabled:opacity-50 disabled:pointer-events-none "} value={`https://url.cordmarston.com/`+data?.alias } readOnly/>
        {!copied ? 
          <button onClick={() => {navigator.clipboard.writeText(`https://url.cordmarston.com/l/`+data?.alias); setCopied(true)}} className="p-6 shrink-0 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-e-md border border-transparent bg-violet-700 text-white focus:outline-none focus:bg-violet-700">
            Copy
          </button>
        :
          <button onClick={() => {navigator.clipboard.writeText(`https://url.cordmarston.com/l/`+data?.alias); setCopied(true)}} className="p-6 shrink-0 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-e-md border border-transparent bg-violet-700 text-white focus:outline-none focus:bg-violet-700">
            &#10003; Copied
          </button>
        }
      </div>
      <div className="text-white w-full text-center mt-4 hidden">Login to save your links.</div>
    </div>
  )
}

export default function Index() {
  const actionData = useActionData<ActionData>();
  const loaderData = useLoaderData<LoaderData>();
  return (
    <>
      <header className="flex flex-col items-center">
        <h2 className="text-6xl text-gray-800 dark:text-gray-100">
          <span className="text-violet-600 font-extrabold">URL</span> Bookmark Tool
        </h2>
      </header>
      {actionData?.data?.link ? <UrlBookmark data={actionData?.data}/> : <UrlForm errors={actionData?.errors}/>}
      { loaderData === null ?  <div className="text-sm text-gray-200">Please <Link to="/login">login</Link> to save your links to your profile & view analytics.</div> : '' }
    </>
  );
}