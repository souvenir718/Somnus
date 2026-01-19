"use client";

import { useEffect, useRef } from "react";

interface TimeWheelProps {
    value: string; // "HH:MM"
    onChange: (value: string) => void;
}

export default function TimeWheel({ value, onChange }: TimeWheelProps) {
    const [hours, minutes] = value.split(":").map(Number);
    const hoursRef = useRef<HTMLDivElement>(null);
    const minutesRef = useRef<HTMLDivElement>(null);

    const hoursList = Array.from({ length: 24 }, (_, i) => i);
    const minutesList = Array.from({ length: 60 }, (_, i) => i);

    // Scroll helpers
    const scrollToValue = (container: HTMLDivElement | null, val: number) => {
        if (!container) return;
        const itemHeight = 40; // Approx height of one item
        container.scrollTop = val * itemHeight;
    };

    // Initial scroll position
    useEffect(() => {
        scrollToValue(hoursRef.current, hours);
        scrollToValue(minutesRef.current, minutes);
    }, []); // Run once on mount to set initial pos

    // Handle Scroll to update value
    const handleScroll = (type: 'hour' | 'minute', e: React.UIEvent<HTMLDivElement>) => {
        const target = e.target as HTMLDivElement;
        const itemHeight = 40;

        // Simple debounce could be added here for performance if needed
        let newValue = Math.round(target.scrollTop / itemHeight);

        if (type === 'hour') {
            if (newValue >= 24) newValue = 23;
            if (newValue !== hours) onChange(`${newValue.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
        } else {
            if (newValue >= 60) newValue = 59;
            if (newValue !== minutes) onChange(`${hours.toString().padStart(2, '0')}:${newValue.toString().padStart(2, '0')}`);
        }
    };

    return (
        <div className="flex h-32 w-full max-w-[200px] justify-center gap-4 relative">
            {/* Selection Highlight Mask */}
            <div className="absolute top-[34%] h-10 w-full bg-white/10 rounded-lg pointer-events-none z-10 border border-white/20"></div>

            {/* Hours */}
            <div
                ref={hoursRef}
                onScroll={(e) => handleScroll('hour', e)}
                className="h-full w-16 overflow-y-auto snap-y snap-mandatory no-scrollbar text-center"
                style={{ scrollBehavior: 'smooth' }}
            >
                <div className="h-[34%]"></div> {/* Spacer */}
                {hoursList.map(h => (
                    <div key={h} className="h-10 flex items-center justify-center snap-center text-2xl font-bold text-white/50 aria-[selected=true]:text-white aria-[selected=true]:scale-110 transition-all">
                        <span aria-selected={h === hours}>{h.toString().padStart(2, '0')}</span>
                    </div>
                ))}
                <div className="h-[34%]"></div> {/* Spacer */}
            </div>

            {/* Minutes */}
            <div
                ref={minutesRef}
                onScroll={(e) => handleScroll('minute', e)}
                className="h-full w-16 overflow-y-auto snap-y snap-mandatory no-scrollbar text-center"
            >
                <div className="h-[34%]"></div> {/* Spacer */}
                {minutesList.map(m => (
                    <div key={m} className="h-10 flex items-center justify-center snap-center text-2xl font-bold text-white/50 aria-[selected=true]:text-white aria-[selected=true]:scale-110 transition-all">
                        <span aria-selected={m === minutes}>{m.toString().padStart(2, '0')}</span>
                    </div>
                ))}
                <div className="h-[34%]"></div> {/* Spacer */}
            </div>
        </div>
    );
}
