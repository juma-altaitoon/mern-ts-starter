import React from "react";

const About: React.FC = () => {
    return(
        <div className="prose max-w-none">
            <h1>About this project </h1>
            <p>This starter project demonstrates a modern frontend using Vite, React, TypeScript, Tailwind, and shadcn/ui</p>
            <h2>Architecture</h2>
            <ul>
                <li>
                    Feature-first structure
                </li>
                <li>Typed API (Axios)</li>
                <li>React Query for server state</li>
                <li>etc...</li>
            </ul>
        </div>
    );
};

export default About;