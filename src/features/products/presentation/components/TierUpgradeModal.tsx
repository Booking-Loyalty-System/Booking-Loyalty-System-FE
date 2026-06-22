import React, { useEffect, useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, X } from 'lucide-react';
import { useCustomerMe } from '@/features/products/application/useCustomer.ts';

export const TierUpgradeModal: React.FC = () => {
    const { customerMe } = useCustomerMe();
    const [isOpen, setIsOpen] = useState(false);
    const [newTier, setNewTier] = useState<string | null>(null);
    const previousTierRef = useRef<string | null>(null);

    useEffect(() => {
        if (!customerMe) return;

        // Bỏ qua lần load đầu tiên
        if (!previousTierRef.current) {
            previousTierRef.current = customerMe.tier;
            return;
        }

        // Phát hiện thay đổi tier (thăng hạng)
        if (customerMe.tier !== previousTierRef.current) {
            setNewTier(customerMe.tier);
            setIsOpen(true);
            triggerConfetti();
            previousTierRef.current = customerMe.tier;
        }
    }, [customerMe]);

    const triggerConfetti = () => {
        const duration = 3000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff'],
                zIndex: 9999
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff'],
                zIndex: 9999
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };
        frame();
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
            style={{ zIndex: 99999 }}
        >
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative overflow-hidden text-center transform transition-all">
                <button 
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-10"
                >
                    <X className="w-5 h-5" />
                </button>
                
                {/* Background effect */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-amber-200 to-orange-400 opacity-20"></div>
                
                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/30 mb-6">
                        <Trophy className="w-10 h-10" />
                    </div>
                    
                    <h2 className="text-3xl font-black text-slate-800 mb-2">Congratulations!</h2>
                    <p className="text-slate-500 font-medium mb-6">
                        You have been upgraded to <strong className="text-amber-500 text-lg uppercase tracking-wider">{newTier}</strong> Tier.
                    </p>
                    
                    <button 
                        onClick={() => setIsOpen(false)}
                        className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-slate-800 active:scale-95 transition-all"
                    >
                        Explore Perks
                    </button>
                </div>
            </div>
        </div>
    );
};
