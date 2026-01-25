"use client";

import { useRef, useEffect, useState } from "react";

interface CycleSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    cycleDuration: number;
    onDurationChange: (duration: number) => void;
}

export default function CycleSettingsModal({ isOpen, onClose, cycleDuration, onDurationChange }: CycleSettingsModalProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [localDuration, setLocalDuration] = useState(cycleDuration);

    // Range of cycle durations: 60 min to 120 min, step 10
    const values = Array.from({ length: 7 }, (_, i) => 60 + i * 10); // 60, 70, ... 120

    // Sync local state when modal opens or prop updates
    useEffect(() => {
        if (isOpen) {
            setLocalDuration(cycleDuration);
        }
    }, [isOpen, cycleDuration]);

    useEffect(() => {
        if (isOpen && scrollRef.current) {
            // Center the selected value based on local state
            const index = values.indexOf(localDuration);
            if (index !== -1) {
                const itemWidth = 80;
                scrollRef.current.scrollLeft = index * itemWidth;
            }
        }
    }, [isOpen, localDuration]); // Depend on localDuration for scrolling

    const handleScroll = () => {
        if (!scrollRef.current) return;

        const itemWidth = 80;
        const index = Math.round(scrollRef.current.scrollLeft / itemWidth);
        const value = values[index];

        if (value && value !== localDuration) {
            setLocalDuration(value);
        }
    };

    const handleDone = () => {
        onDurationChange(localDuration);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300">

            {/* Close Button - discard changes */}
            <button
                onClick={onClose}
                className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <div className="w-full max-w-md p-8 flex flex-col items-center gap-12 text-center">

                <h2 className="text-2xl font-bold text-white">Cycle Duration</h2>

                {/* Horizontal Picker */}
                <div className="relative w-full h-32 flex items-center">
                    {/* Center Highlight */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-transparent z-10 pointer-events-none"></div>

                    <div
                        ref={scrollRef}
                        onScroll={handleScroll}
                        className="w-full overflow-x-auto snap-x snap-mandatory flex items-center no-scrollbar px-[calc(50%-40px)]"
                    >
                        {values.map((val) => (
                            <div
                                key={val}
                                className={`flex-shrink-0 w-20 h-20 flex items-center justify-center snap-center transition-all duration-300 ${val === localDuration
                                    ? "text-6xl font-bold text-white"
                                    : "text-4xl font-bold text-zinc-600 scale-75"
                                    }`}
                                onClick={() => {
                                    setLocalDuration(val);
                                    if (scrollRef.current) {
                                        const index = values.indexOf(val);
                                        const itemWidth = 80;
                                        scrollRef.current.scrollTo({
                                            left: index * itemWidth,
                                            behavior: "smooth"
                                        });
                                    }
                                }}
                            >
                                {val}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <p className="text-brand-secondary text-xl font-medium">
                        Average cycle is <br />
                        <span className="text-3xl font-bold text-white">{localDuration} min</span>
                    </p>
                </div>

                <button
                    onClick={handleDone}
                    className="px-6 py-2 bg-brand-secondary text-white rounded-full font-bold shadow-lg hover:brightness-110 transition-all flex items-center gap-1"
                >
                    <span className="bg-white rounded-full p-0.5 text-brand-secondary">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                        </svg>
                    </span>
                    Done
                </button>

            </div>
        </div>
    );
}
