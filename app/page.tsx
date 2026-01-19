"use client";

import { useState, useEffect } from "react";
import { calculateWakeUpTimes, calculateBedTimes, type SleepCycle } from "./utils/sleep";
import TimeWheel from "./components/TimeWheel";
import FallAsleepSlider from "./components/FallAsleepSlider";
import ModeToggle from "./components/ModeToggle";
import ResultsList from "./components/ResultsList";
import CycleSettingsModal from "./components/CycleSettingsModal";

export default function Home() {
  const [mode, setMode] = useState<"wake" | "sleep">("wake");
  const [targetTime, setTargetTime] = useState<string>("07:00");
  const [fallAsleepTime, setFallAsleepTime] = useState<number>(15);
  const [cycleDuration, setCycleDuration] = useState<number>(90);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const [results, setResults] = useState<SleepCycle[]>([]);

  // Real-time calculation effect
  useEffect(() => {
    if (mode === "wake") {
      // "Wake" mode: User sets WAKE time, we calculate BED times
      const today = new Date();
      const [hours, minutes] = targetTime.split(":").map(Number);
      const wakeUpDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes);

      // If the time is in the past for today, assume it's for tomorrow
      if (wakeUpDate < new Date()) {
        wakeUpDate.setDate(wakeUpDate.getDate() + 1);
      }

      setResults(calculateBedTimes(wakeUpDate, fallAsleepTime, cycleDuration));
    } else {
      // "Sleep" mode
      const today = new Date();
      const [hours, minutes] = targetTime.split(":").map(Number);
      const sleepDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes);

      if (sleepDate.getTime() < Date.now() - 12 * 60 * 60 * 1000) {
        sleepDate.setDate(sleepDate.getDate() + 1);
      }

      setResults(calculateWakeUpTimes(sleepDate, fallAsleepTime, cycleDuration));
    }
  }, [mode, targetTime, fallAsleepTime, cycleDuration]);

  return (
    <div className="flex min-h-screen flex-col bg-black text-white font-sans overflow-hidden">

      {/* Settings Modal */}
      <CycleSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        cycleDuration={cycleDuration}
        onDurationChange={setCycleDuration}
      />

      {/* Header / Top Bar */}
      <header className="px-6 py-4 flex justify-between items-center z-10">
        <h1 className="text-2xl font-bold tracking-tight">Sommnus</h1>
        {/* Menu Icon */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="w-10 h-10 flex items-center justify-center -mr-2 opacity-80 hover:opacity-100 transition-opacity"
        >
          <div className="w-6 h-6 flex flex-col justify-center gap-1.5 align-end">
            <div className="w-full h-0.5 bg-white rounded-full"></div>
            <div className="w-3/4 h-0.5 bg-white rounded-full ml-auto"></div>
            <div className="w-full h-0.5 bg-white rounded-full"></div>
          </div>
        </button>
      </header>

      {/* Main Content Area - Scrollable Results */}
      <main className="flex-1 overflow-y-auto pb-[400px]"> {/* Padding bottom to account for fixed controls */}
        <div className="pt-4 pb-8">
          <ResultsList results={results} mode={mode} />
        </div>
      </main>

      {/* Fixed Bottom Controls */}
      <div className="fixed bottom-0 left-0 w-full bg-black/80 backdrop-blur-xl border-t border-white/10 rounded-t-[3rem] p-8 flex flex-col gap-8 z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">

        {/* Time Wheel */}
        <div className="flex justify-center w-full">
          <TimeWheel value={targetTime} onChange={setTargetTime} />
        </div>

        {/* Sliders & Toggles */}
        <div className="flex flex-col items-center gap-6">
          <FallAsleepSlider value={fallAsleepTime} onChange={setFallAsleepTime} />

          <ModeToggle mode={mode} onChange={setMode} />
        </div>
      </div>

    </div>
  );
}
