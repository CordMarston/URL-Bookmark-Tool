
import { ActionFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { authenticator } from "~/services/auth.server";

export const meta: MetaFunction = () => {
  return [
    { title: "URL Bookmarker - My Links" },
    { name: "description", content: "Bookmark links to send to mobile." },
  ];
};

export let loader: LoaderFunction = async ({ request }) => {
  return await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
};

export const action: ActionFunction = async ({ request }) => {
  await authenticator.logout(request, { redirectTo: "/login" });
};

export default function DashboardPage() {
  const data = useLoaderData();
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
      <div className="mt-4 my-8 w-full max-w-7xl text-gray-100 bg-gray-700 p-8">
        Test
      </div>
    </>
  );
}