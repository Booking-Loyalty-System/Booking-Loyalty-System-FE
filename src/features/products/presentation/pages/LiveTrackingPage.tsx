import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Car, Clock, Droplets, CheckCircle2, AlertCircle, 
    Sparkles, ArrowLeft, Activity
} from 'lucide-react';
import { useBooking } from '../../application/useBooking';
import { format } from 'date-fns';

type WashStatus = 'Pending' | 'Confirmed' | 'CheckedIn' | 'Queued' | 'InProgress' | 'Completed' | 'CheckedOut' | 'Cancelled' | 'NoShow';

interface StatusStep {
    id: WashStatus[];
    label: string;
    icon: React.ElementType;
    description: string;
}

const washSteps: StatusStep[] = [
    { id: ['CheckedIn'], label: 'Checked In', icon: CheckCircle2, description: 'Vehicle checked in at facility' },
    { id: ['Queued'], label: 'In Queue', icon: Clock, description: 'Waiting for available bay' },
    { id: ['InProgress'], label: 'Washing & Drying', icon: Droplets, description: 'Active wash in progress' },
    { id: ['Completed', 'CheckedOut'], label: 'Completed', icon: Sparkles, description: 'Ready for pickup!' },
];

export const LiveTrackingPage: React.FC = () => {
    const { bookingId } = useParams<{ bookingId: string }>();
    const navigate = useNavigate();
    const { useGetBookingById } = useBooking();
    
    const { data: booking, isLoading, error } = useGetBookingById(bookingId || '');

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 font-bold animate-pulse">Connecting to live tracking...</p>
            </div>
        );
    }

    if (error || !booking) {
        return (
            <div className="max-w-md mx-auto mt-20 text-center space-y-6 p-8 bg-white rounded-3xl border border-slate-100 shadow-xl">
                <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-500">
                    <AlertCircle className="w-10 h-10" />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-slate-900">Booking Not Found</h2>
                    <p className="text-slate-500 font-medium mt-2">We couldn't find the tracking information for this booking.</p>
                </div>
                <button 
                    onClick={() => navigate('/dashboard')}
                    className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all"
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    const currentStatus = booking.status;
    
    const getCurrentStepIndex = () => {
        return washSteps.findIndex(step => step.id.includes(currentStatus));
    };

    const isStepCompleted = (index: number) => {
        return index < getCurrentStepIndex();
    };

    const isStepActive = (index: number) => {
        return index === getCurrentStepIndex();
    };

    // Calculate progress percentage for the bar
    const getProgressPercentage = () => {
        const index = getCurrentStepIndex();
        if (index === -1) return 0;
        if (currentStatus === 'Completed' || currentStatus === 'CheckedOut') return 100;
        return ((index + 0.5) / washSteps.length) * 100;
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-700">
            {/* Header Navigation */}
            <div className="flex items-center justify-between">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors group"
                >
                    <div className="p-2 bg-white rounded-xl border border-slate-100 group-hover:border-slate-200 shadow-sm">
                        <ArrowLeft className="w-5 h-5" />
                    </div>
                    Back
                </button>
                <div className="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-ping"></div>
                    <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Live Updates Enabled</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Main Status */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Hero Progress Card */}
                    <div className="bg-gradient-to-br from-[#1e6ffd] to-[#1d4ed8] rounded-[48px] p-10 text-white relative overflow-hidden shadow-2xl shadow-blue-500/20">
                        <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                        
                        <div className="relative z-10 space-y-10">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div>
                                    <span className="text-blue-100 text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Order Tracking</span>
                                    <h1 className="text-4xl font-black tracking-tight mt-1">#BW-{booking.bookingCode}</h1>
                                </div>
                                <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/10 text-center min-w-[140px]">
                                    <p className="text-3xl font-black tracking-tighter">
                                        {currentStatus === 'Completed' || currentStatus === 'CheckedOut' ? 'DONE' : 'LIVE'}
                                    </p>
                                    <p className="text-[10px] font-black text-blue-100 uppercase tracking-widest mt-1">Status</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm font-black text-blue-50 uppercase tracking-widest">
                                    <span>Overall Progress</span>
                                    <span>{Math.round(getProgressPercentage())}%</span>
                                </div>
                                <div className="w-full bg-white/10 h-5 rounded-3xl overflow-hidden p-1 border border-white/5 backdrop-blur-sm">
                                    <div 
                                        className="bg-white h-full rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all duration-1000 ease-out"
                                        style={{ width: `${getProgressPercentage()}%` }}
                                    ></div>
                                </div>
                                <p className="text-blue-50 font-bold opacity-90 flex items-center gap-2">
                                    <Activity className="w-4 h-4 animate-pulse" />
                                    Current Stage: <span className="text-white font-black">{currentStatus}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Timeline Card */}
                    <div className="bg-white border border-slate-100 rounded-[48px] p-10 shadow-sm space-y-10">
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Wash Journey</h3>
                        
                        <div className="space-y-12 relative">
                            {washSteps.map((step, index) => {
                                const Icon = step.icon;
                                const completed = isStepCompleted(index);
                                const active = isStepActive(index);
                                
                                return (
                                    <div key={index} className="flex gap-8 relative">
                                        {/* Connector */}
                                        {index < washSteps.length - 1 && (
                                            <div className={`absolute left-7 top-14 w-1 h-12 rounded-full ${completed ? 'bg-emerald-500' : 'bg-slate-100'}`}></div>
                                        )}

                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 shadow-xl ${
                                            completed ? 'bg-emerald-500 text-white shadow-emerald-100' : 
                                            active ? 'bg-blue-600 text-white shadow-blue-100 scale-110 rotate-3 animate-pulse' : 
                                            'bg-slate-50 text-slate-300'
                                        }`}>
                                            <Icon className="w-7 h-7" />
                                        </div>

                                        <div className="flex-1 pt-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className={`text-xl font-black tracking-tight ${
                                                    active ? 'text-blue-600' : completed ? 'text-emerald-600' : 'text-slate-300'
                                                }`}>
                                                    {step.label}
                                                </h4>
                                                {completed && <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-lg uppercase tracking-widest">Finished</span>}
                                                {active && <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-lg uppercase tracking-widest animate-pulse">Processing</span>}
                                            </div>
                                            <p className={`text-sm font-bold ${active || completed ? 'text-slate-500' : 'text-slate-300'}`}>
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right Column - Info Cards */}
                <div className="space-y-6">
                    {/* Vehicle Card */}
                    <div className="bg-white border border-slate-100 rounded-[36px] p-8 shadow-sm space-y-6 group hover:border-blue-200 transition-colors">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-black text-slate-900 tracking-tight">Vehicle Details</h3>
                            <div className="p-2 bg-slate-50 rounded-xl">
                                <Car className="w-5 h-5 text-slate-400" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">License Plate</p>
                                <p className="text-xl font-black text-blue-600 mt-1">{booking.vehicleId.substring(0, 8).toUpperCase()}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</p>
                                    <p className="font-black text-slate-700 mt-1">Premium</p>
                                </div>
                                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</p>
                                    <p className="font-black text-emerald-600 mt-1">Verified</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Appointment Card */}
                    <div className="bg-white border border-slate-100 rounded-[36px] p-8 shadow-sm space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-black text-slate-900 tracking-tight">Appointment</h3>
                            <div className="p-2 bg-slate-50 rounded-xl">
                                <Clock className="w-5 h-5 text-slate-400" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-slate-50">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Date</span>
                                <span className="text-sm font-black text-slate-700">{format(new Date(booking.bookingDate), 'MMM dd, yyyy')}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-50">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Arrival</span>
                                <span className="text-sm font-black text-slate-700">{booking.startTime}</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Branch</span>
                                <span className="text-sm font-black text-blue-600">Main Facility</span>
                            </div>
                        </div>
                    </div>

                    {/* Support Alert */}
                    <div className="bg-slate-900 rounded-[36px] p-8 text-white space-y-4 relative overflow-hidden group">
                        <div className="absolute right-0 bottom-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mb-12"></div>
                        <h3 className="text-lg font-black tracking-tight relative z-10">Need Help?</h3>
                        <p className="text-xs text-slate-400 font-bold leading-relaxed relative z-10">If you have any questions about your wash progress, feel free to contact our support team.</p>
                        <button className="w-full bg-white text-slate-900 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all relative z-10">
                            Contact Support
                        </button>
                    </div>

                    {/* Completion Alert */}
                    {(currentStatus === 'Completed' || currentStatus === 'CheckedOut') && (
                        <div className="bg-emerald-50 border-2 border-emerald-500 rounded-[36px] p-8 space-y-4 animate-in zoom-in duration-500">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-100">
                                    <Sparkles className="w-6 h-6" />
                                </div>
                                <h4 className="text-xl font-black text-emerald-900">Shiny & Clean!</h4>
                            </div>
                            <p className="text-sm font-bold text-emerald-700 leading-relaxed">
                                Your vehicle is ready for pickup. Please show your booking code <span className="font-black text-emerald-900">#BW-{booking.bookingCode}</span> to the staff at the counter.
                            </p>
                            <button 
                                onClick={() => navigate('/booking-history')}
                                className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100"
                            >
                                View Receipt
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
