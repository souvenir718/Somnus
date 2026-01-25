"use client";

import { useState, useRef } from "react";
import TimeWheel from "./TimeWheel";
import FallAsleepSlider from "./FallAsleepSlider";
import ModeToggle from "./ModeToggle";

interface BottomSheetProps {
    targetTime: string;
    setTargetTime: (time: string) => void;
    fallAsleepTime: number;
    setFallAsleepTime: (time: number) => void;
    mode: "wake" | "sleep";
    setMode: (mode: "wake" | "sleep") => void;
}

export default function BottomSheet({
    targetTime,
    setTargetTime,
    fallAsleepTime,
    setFallAsleepTime,
    mode,
    setMode
}: BottomSheetProps) {
    const [isOpen, setIsOpen] = useState(true);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState(0);
    const startY = useRef<number | null>(null);
    const currentY = useRef<number | null>(null);

    const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
        // Only allow dragging from the handle area
        setIsDragging(true);
        const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
        startY.current = y;
        currentY.current = y;
    };

    const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
        if (!startY.current) return;
        const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
        currentY.current = y;
        const delta = y - startY.current;

        // Only allow dragging down if open, or up if closed (with limits)
        if (delta > 0 && isOpen) {
            setDragOffset(delta);
        } else if (delta < 0 && !isOpen) {
            setDragOffset(delta); // Negative value to pull up
        }
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
        if (!startY.current || !currentY.current) return;

        const delta = currentY.current - startY.current;
        const threshold = 50; // dragged distance to trigger toggle

        if (isOpen) {
            if (delta > threshold) {
                setIsOpen(false);
            }
        } else {
            if (delta < -threshold) {
                setIsOpen(true);
            }
        }

        setDragOffset(0);
        startY.current = null;
        currentY.current = null;
    };

    const handleHandleClick = () => {
        // Prevent toggle if it was a drag
        if (Math.abs(dragOffset) < 5) {
            setIsOpen(prev => !prev);
        }
    };

    return (
        <div
            className={`fixed bottom-0 left-0 w-full z-50 transition-transform ease-out will-change-transform ${isDragging ? 'duration-0' : 'duration-300'}`}
            style={{
                // Fix: Ensure units are attached to values, not the end of calc
                transform: `translateY(${isOpen
                    ? `${Math.max(0, dragOffset)}px`
                    : `calc(100% - 90px + ${Math.min(0, dragOffset)}px)`
                    })`
            }}
        >
            {/* Gradient Fade - only visible when fully open */}
            <div className={`w-full h-12 bg-gradient-to-t from-black to-transparent pointer-events-none transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} />

            <div className="bg-black rounded-t-[2.5rem] px-6 pb-10 pt-2 shadow-[0_-4px_20px_rgba(255,255,255,0.05)] border-t border-white/5 relative">
                {/* Drag/Handle Indicator */}
                <div
                    className="w-full flex justify-center py-4 mb-2 cursor-grab active:cursor-grabbing touch-none"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onMouseDown={handleTouchStart}
                    onMouseMove={(e) => isDragging && handleTouchMove(e)}
                    onMouseUp={handleTouchEnd}
                    onMouseLeave={handleTouchEnd}
                    onClick={handleHandleClick}
                >
                    <div className="w-12 h-1 bg-zinc-800 rounded-full" />
                </div>

                {/* Content Container - removed opacity toggle so it stays visible during slide */}
                <div className="flex flex-col gap-8">
                    {/* Time Wheel Section */}
                    <div className="flex justify-center w-full">
                        <TimeWheel value={targetTime} onChange={setTargetTime} />
                    </div>

                    {/* Slider Section */}
                    <div className="px-2">
                        <FallAsleepSlider value={fallAsleepTime} onChange={setFallAsleepTime} />
                    </div>

                    {/* Bottom Actions Row */}
                    <div className="flex items-center justify-center mt-2">
                        {/* Mode Toggle */}
                        <div className="max-w-[240px]">
                            <ModeToggle mode={mode} onChange={setMode} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
