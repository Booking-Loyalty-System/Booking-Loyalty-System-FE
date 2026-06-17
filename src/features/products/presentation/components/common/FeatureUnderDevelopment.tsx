import React from 'react';
import { Construction } from 'lucide-react';

export const FeatureUnderDevelopment: React.FC = () => {
    return (
        <div className="h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
            <Construction className="w-20 h-20 text-yellow-500 mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Feature Under Development</h1>
            <p className="text-lg text-gray-600 max-w-md">
                We are currently working on this module. Please check back later!
            </p>
        </div>
    );
};
