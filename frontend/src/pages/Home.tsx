import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    return (
        <div className='text-center py-16'>
            <h1 className='text-4xl font-bold mb-4'>MERN + Vite & TypeScript Starter</h1>
            <p className='text-lg text-gray-600 mb-6'>Fast dev, modular components, accessible UI primitives</p>
            <div className='flex justify-center gap-4'>
                <Link to='/signup' >Get Started</Link>
                 <Link to='/about' >Learn more</Link>
            </div>
        </div>
    )
}

export default Home;