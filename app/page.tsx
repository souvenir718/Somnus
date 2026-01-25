"use client";

import { useState, useEffect } from "react";
import { calculateWakeUpTimes, calculateBedTimes, type SleepCycle } from "./utils/sleep";
import ResultsList from "./components/ResultsList";
import CycleSettingsModal from "./components/CycleSettingsModal";
import BottomSheet from "./components/BottomSheet";

export default function Home() {
  const [mode, setMode] = useState<"wake" | "sleep">("sleep");
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
      <main className="flex-1 overflow-y-auto pb-[480px]"> {/* Extensive padding for bottom sheet */}
        <div className="pt-4 pb-8">
          <ResultsList results={results} mode={mode} cycleDuration={cycleDuration} />
        </div>
      </main>

      {/* Bottom Sheet Controls */}
      <BottomSheet
        targetTime={targetTime}
        setTargetTime={setTargetTime}
        fallAsleepTime={fallAsleepTime}
        setFallAsleepTime={setFallAsleepTime}
        mode={mode}
        setMode={setMode}
      />

    </div>
  );
}
