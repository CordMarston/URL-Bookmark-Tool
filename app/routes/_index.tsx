import type { ActionFunction, MetaFunction } from "@remix-run/node";
import { Form, json, useActionData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "URL Bookmarker" },
    { name: "description", content: "Bookmark links to send to mobile." },
  ];
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const link = formData.get('link');

  if (typeof link !== 'string' || link.length === 0) {
    return json({ errors: { link: 'Link is required' } }, { status: 422 });
  }

  return true;
};

export default function Index() {
  const actionData = useActionData<{ errors: { link: string } }>();
  
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex flex-col items-center w-screen">
        <header className="flex flex-col items-center">
          <h2 className="text-6xl text-gray-800 dark:text-gray-100">
            <span className="text-violet-600 font-extrabold">URL</span> Bookmark Tool
          </h2>
        </header>
        
        <Form method="post" className="my-8 w-full max-w-7xl text-gray-100  bg-gray-800 p-8">
          <div  className="m-2">
            <label>Full URL</label>
          </div>
          <input type="text" name="link" className="bg-gray-600 text-white p-6 text-xl block w-full shadow-sm rounded-lg text-sm focus:z-10 focus:border-violet-500 focus:ring-violet-500 disabled:opacity-50 disabled:pointer-events-none" placeholder="https://link.com"/>
            
          <div  className="m-2 mt-4">
            <label>Bookmark URL (Optional)</label>
          </div>
          <div className="flex">
            <div className="p-6  shrink-0 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-s-md border border-transparent bg-gray-700 text-white focus:outline-none focus:bg-violet-700">
              https://url.cordmarston.com/
            </div>
            <input type="text" name="link" className="bg-gray-600 text-white p-6 text-xl block w-full shadow-sm rounded-e-lg text-sm focus:z-10 focus:border-violet-500 focus:ring-violet-500 disabled:opacity-50 disabled:pointer-events-none" placeholder="custom-alias"/>
          </div>
          <button type="submit" className="mt-8 w-full p-6 shrink-0 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-md border border-transparent bg-violet-600 text-white hover:bg-violet-400 focus:outline-none focus:bg-violet-700 disabled:opacity-50 disabled:pointer-events-none">
            Bookmark
          </button>
        </Form>

      </div>
    </div>
  );
}