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

    // 5x duplication to prevent jump during normal wrap-around
    const infiniteHours = [...hoursList, ...hoursList, ...hoursList, ...hoursList, ...hoursList];
    const infiniteMinutes = [...minutesList, ...minutesList, ...minutesList, ...minutesList, ...minutesList];

    const ITEM_HEIGHT = 40;
    const CENTER_OFFSET = 44; // (128px container - 40px item) / 2 = 44px

    // Scroll helpers
    const scrollToValue = (container: HTMLDivElement | null, val: number, count: number) => {
        if (!container) return;
        // Start in the middle set (Set 3, index offset 2 * count)
        const targetIndex = val + (count * 2);
        container.scrollTop = targetIndex * ITEM_HEIGHT - CENTER_OFFSET;
    };

    // Initial scroll position
    useEffect(() => {
        scrollToValue(hoursRef.current, hours, 24);
        scrollToValue(minutesRef.current, minutes, 60);
    }, []); // Run once on mount

    // Handle Scroll to update value
    const handleScroll = (type: 'hour' | 'minute', e: React.UIEvent<HTMLDivElement>) => {
        const target = e.target as HTMLDivElement;
        const count = type === 'hour' ? 24 : 60;
        const singleSetHeight = count * ITEM_HEIGHT;

        // Infinite Scroll "Teleport" Logic
        // We have 5 sets: [0, 1, 2, 3, 4]
        // Target is to stay in Set 2 (Middle).
        // Buffer: Allow wandering into Set 1 and Set 3.
        // Jump if we hit Set 0 or Set 4.

        if (target.scrollTop < singleSetHeight) {
            target.scrollTop += (singleSetHeight * 2);
        } else if (target.scrollTop > singleSetHeight * 4) {
            target.scrollTop -= (singleSetHeight * 2);
        }

        // Calculate value based on position
        const rawIndex = Math.round((target.scrollTop + CENTER_OFFSET) / ITEM_HEIGHT);
        const newValue = rawIndex % count;

        if (type === 'hour') {
            if (newValue !== hours) {
                onChange(`${newValue.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
            }
        } else {
            if (newValue !== minutes) {
                onChange(`${hours.toString().padStart(2, '0')}:${newValue.toString().padStart(2, '0')}`);
            }
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
            >
                {infiniteHours.map((h, i) => (
                    <div key={i} className="h-10 flex items-center justify-center snap-center text-2xl font-bold text-white/50 aria-[selected=true]:text-white aria-[selected=true]:scale-110 transition-all">
                        <span aria-selected={h === hours}>{h.toString().padStart(2, '0')}</span>
                    </div>
                ))}
            </div>

            {/* Minutes */}
            <div
                ref={minutesRef}
                onScroll={(e) => handleScroll('minute', e)}
                className="h-full w-16 overflow-y-auto snap-y snap-mandatory no-scrollbar text-center"
            >
                {infiniteMinutes.map((m, i) => (
                    <div key={i} className="h-10 flex items-center justify-center snap-center text-2xl font-bold text-white/50 aria-[selected=true]:text-white aria-[selected=true]:scale-110 transition-all">
                        <span aria-selected={m === minutes}>{m.toString().padStart(2, '0')}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
