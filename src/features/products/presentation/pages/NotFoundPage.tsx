import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../application/useAuth';

export const NotFoundPage: React.FC = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    const handleBack = () => {
        if (!isAuthenticated || !user || user.role === 'Admin') {
            navigate('/login');
            return;
        }

        switch (user.role) {
            case 'Staff':
                navigate('/staff/dashboard');
                break;
            default:
                navigate('/dashboard');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center space-y-6">
            <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 animate-bounce">
                <AlertTriangle className="w-12 h-12" />
            </div>
            <div className="space-y-2">
                <h1 className="text-6xl font-black text-slate-900 tracking-tighter">404</h1>
                <h2 className="text-2xl font-bold text-slate-800">Oops! Page not found</h2>
                <p className="text-slate-500 font-medium max-w-sm mx-auto">
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>
            </div>
            <button 
                onClick={handleBack}
                className="group bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-black transition-all flex items-center gap-3 shadow-xl shadow-slate-200 active:scale-95"
            >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                {(!isAuthenticated || !user || user.role === 'Admin') ? 'Back to Login' : 'Back to Dashboard'}
            </button>
        </div>
    );
};
