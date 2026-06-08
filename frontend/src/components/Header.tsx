import React from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {

    return (
        <header className="bg-white shadow">
            <h1>Header</h1>
            <div className="container mx-auto px-4 py-3 flex items-center justify-between ">
                <Link to="/" className="text-lg font-semibold">MERN TS Starter</Link>
                <nav>
                    <ul>
                        <li><Link to="/" className="text-sm text-gray-700 ">Home</Link></li>
                        <li><Link to="/about" className="text-sm text-gray-700 ">About</Link></li>
                        <li><Link to="/contact" className="text-sm text-gray-700 ">Contact</Link></li>
                        <li><Link to="/dashboard" className="text-sm text-gray-700 ">Dashboard</Link></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Header;