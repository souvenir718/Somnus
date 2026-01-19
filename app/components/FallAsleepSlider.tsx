"use client";

import { useMemo } from "react";

interface FallAsleepSliderProps {
    value: number;
    onChange: (value: number) => void;
}

export default function FallAsleepSlider({ value, onChange }: FallAsleepSliderProps) {
    const steps = [0, 15, 30, 45, 60];

    // Calculate percentage for the filled track
    const percentage = useMemo(() => {
        return (value / 60) * 100;
    }, [value]);

    return (
        <div className="w-full flex flex-col items-center gap-4">
            <div className="relative w-full h-12 flex items-center justify-center">
                {/* Track Background */}
                <div className="absolute w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    {/* Filled Track */}
                    <div
                        className="h-full bg-brand-secondary transition-all duration-200"
                        style={{ width: `${percentage}%` }}
                    />
                </div>

                {/* Step dots */}
                <div className="absolute w-full flex justify-between px-1">
                    {steps.map((step) => (
                        <button
                            key={step}
                            onClick={() => onChange(step)}
                            className={`w-4 h-4 rounded-full transition-all duration-200 z-10 ${value >= step ? "bg-brand-secondary scale-125" : "bg-zinc-700"
                                }`}
                        />
                    ))}
                </div>

                {/* Label below the active Step */}
                <div className="absolute top-8 w-full flex justify-between px-0 text-xs text-zinc-500 font-medium">
                    {steps.map((step) => (
                        <span key={step} className={value === step ? "text-white" : ""}>{step}</span>
                    ))}
                </div>

                {/* Unit */}
                <div className="absolute right-[-2rem] top-8 text-xs text-zinc-500">min</div>
            </div>
        </div>
    );
}
