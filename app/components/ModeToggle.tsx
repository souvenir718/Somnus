"use client";

interface ModeToggleProps {
    mode: "sleep" | "wake";
    onChange: (mode: "sleep" | "wake") => void;
}

export default function ModeToggle({ mode, onChange }: ModeToggleProps) {
    return (
        <div className="relative flex w-48 h-12 bg-black border border-zinc-800 rounded-full p-1 overflow-hidden">
            {/* Sliding Background */}
            <div
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-brand-secondary rounded-full transition-all duration-300 ${mode === "sleep" ? "left-1" : "left-[calc(50%+2px)]"
                    }`}
            />

            <button
                onClick={() => onChange("sleep")}
                className={`flex-1 z-10 flex items-center justify-center text-sm font-medium transition-colors duration-300 ${mode === "sleep" ? "text-white" : "text-zinc-500"
                    }`}
            >
                <span className="mr-1">✓</span> Sleep
            </button>

            <button
                onClick={() => onChange("wake")}
                className={`flex-1 z-10 flex items-center justify-center text-sm font-medium transition-colors duration-300 ${mode === "wake" ? "text-white" : "text-zinc-500"
                    }`}
            >
                Wake
            </button>
        </div>
    );
}
