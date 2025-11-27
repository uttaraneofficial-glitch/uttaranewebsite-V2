import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const SoftwareDevelopment = () => {
    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <div className="pt-24 px-4 pb-12">
                <div className="container mx-auto max-w-4xl">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Software <span className="text-red-500">Development</span>
                    </h1>
                    <p className="text-xl text-gray-400 mb-12">
                        Explore career opportunities, interview experiences, and resources for Software Development roles.
                    </p>

                    <div className="grid gap-6">
                        <div className="p-8 border border-gray-800 rounded-2xl bg-gray-900/30 backdrop-blur-sm">
                            <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
                            <p className="text-gray-400">
                                We are currently curating the best resources and interview experiences for Software Development.
                                Check back soon for updates!
                            </p>
                        </div>
                    </div>

                    <div className="mt-12">
                        <Link
                            to="/company"
                            className="inline-flex items-center text-red-500 hover:text-red-400 font-semibold transition-colors"
                        >
                            <span className="mr-2">←</span> Back to Companies
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default SoftwareDevelopment;
