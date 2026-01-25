"use client";

import { type SleepCycle, formatTime } from "../utils/sleep";

interface ResultsListProps {
    results: SleepCycle[];
    mode: "sleep" | "wake";
    cycleDuration: number;
}

export default function ResultsList({ results, cycleDuration }: ResultsListProps) {
    const suggested = results.filter(r => r.cycles >= 5 && r.cycles <= 6);
    const others = results.filter(r => r.cycles < 5 || r.cycles > 6);

    return (
        <div className="w-full flex flex-col gap-8 px-4">

            {/* Suggested Section */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-white">Suggested</h2>
                <div className="space-y-4">
                    {suggested.map((item, i) => (
                        <div key={i} className="flex justify-between items-center text-white">
                            <span className="text-3xl font-bold">{item.formattedTime}</span>
                            <span className="text-zinc-500 text-sm font-medium">
                                {item.cycles} cycles ({formatDuration(item.cycles, cycleDuration)})
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Other Options Section */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-white">Other Options</h2>
                <div className="space-y-4">
                    {others.map((item, i) => (
                        <div key={i} className="flex justify-between items-center text-white">
                            <span className="text-3xl font-bold">{item.formattedTime}</span>
                            <span className="text-zinc-500 text-sm font-medium">
                                {item.cycles} cycles ({formatDuration(item.cycles, cycleDuration)})
                            </span>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}

function formatDuration(cycles: number, durationPerCycle: number) {
    const totalMinutes = cycles * durationPerCycle;
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}
