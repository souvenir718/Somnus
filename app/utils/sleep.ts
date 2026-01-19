/**
 * Calculates the best times to wake up if you go to sleep at a given time.
 * @param startTime The time you go to bed (defaults to now).
 * @param fallAsleepMinutes Minutes it takes to fall asleep.
 * @param cycleDurationMinutes Duration of one sleep cycle in minutes (default 90).
 * @returns Array of suggested wake up times.
 */
export function calculateWakeUpTimes(startTime: Date, fallAsleepMinutes: number, cycleDurationMinutes: number = 90): SleepCycle[] {
  // Adjust start time by adding "fall asleep" time
  const sleepTime = new Date(startTime.getTime() + fallAsleepMinutes * 60000);

  const cyclesToCalculate = [1, 2, 3, 4, 5, 6, 7]; // Extended range for "Other Options"

  return cyclesToCalculate.map((cycleCount) => {
    const durationMinutes = cycleCount * cycleDurationMinutes;
    const wakeUpTime = new Date(sleepTime.getTime() + durationMinutes * 60000);

    let label = "Okay";
    if (cycleCount === 5 || cycleCount === 6) label = "Best";
    if (cycleCount === 4) label = "Good";

    return {
      cycles: cycleCount,
      time: wakeUpTime,
      // For wake up times, we display the wake up time
      formattedTime: formatTime(wakeUpTime),
      label,
    };
  });
}

/**
 * Calculates the best times to go to bed if you want to wake up at a specific time.
 * @param wakeUpTime The target wake up time.
 * @param fallAsleepMinutes Minutes it takes to fall asleep.
 * @param cycleDurationMinutes Duration of one sleep cycle in minutes (default 90).
 * @returns Array of suggested bed times.
 */
export function calculateBedTimes(wakeUpTime: Date, fallAsleepMinutes: number, cycleDurationMinutes: number = 90): SleepCycle[] {
  const cyclesToCalculate = [1, 2, 3, 4, 5, 6, 7];

  // We need to subtract the cycle time AND the fall asleep time
  const result = cyclesToCalculate.map((cycleCount) => {
    const durationMinutes = cycleCount * cycleDurationMinutes;
    const bedTime = new Date(wakeUpTime.getTime() - durationMinutes * 60000 - fallAsleepMinutes * 60000);

    let label = "Okay";
    if (cycleCount === 5 || cycleCount === 6) label = "Best";
    if (cycleCount === 4) label = "Good";

    return {
      cycles: cycleCount,
      time: bedTime,
      formattedTime: formatTime(bedTime), // Helper property
      label,
    };
  });

  // Sort by time ascending (earliest first)
  return result.sort((a, b) => a.time.getTime() - b.time.getTime());
}

/**
 * Formats a Date object into a readable time string (e.g., "10:30")
 * 24-hour format as per the design image
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
}

export type SleepCycle = {
  cycles: number;
  time: Date;
  formattedTime: string;
  label: string;
};
