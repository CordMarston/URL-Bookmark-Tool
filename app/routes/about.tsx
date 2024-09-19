import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
export const meta: MetaFunction = () => {
    return [
      { title: "URL Bookmarker - About" },
      { name: "description", content: "Bookmark links to send to mobile." },
    ];
  };
  
export default function About() {
    return (
        <>
            <header className="flex flex-col items-center">
                <h2 className="text-6xl text-gray-800 dark:text-gray-100">
                About <span className="text-violet-600 font-extrabold">URL</span> Bookmark Tool
                </h2>
            </header>
            <div className="my-8 w-full max-w-7xl text-gray-100  bg-gray-800 p-8 space-y-4">
                <p>I built this tool to allow me to seemlessly transfer links from my PC to mobile device. Eventually I play to add analytics and more, in an attempt to "clone" a URL shortening service like tinyurl.</p>
                <p>The tool was built as a learning project. I wanted to check out what Remix had to offer as opposed to building it in my normal framework of Vue or NextJS.</p>
                <p>To view the sourcecode of this project check it out on <Link className="underline" target="_blank" to="https://github.com/CordMarston/url_cordmarston_com">Github</Link>.</p>
            </div>
        </>
    )
}