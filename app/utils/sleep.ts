/**
 * Calculates the best times to wake up if you go to sleep at a given time.
 * @param startTime The time you go to bed (defaults to now).
 * @param fallAsleepMinutes Minutes it takes to fall asleep.
 * @param cycleDurationMinutes Duration of one sleep cycle in minutes (default 90).
 * @returns Array of suggested wake up times.
 */
export function calculateWakeUpTimes(startTime: Date, fallAsleepMinutes: number, cycleDurationMinutes: number = 90): SleepCycle[] {
  // Adjust start time by adding "fall asleep" time
  // Logic: TargetTime + LATENCY + (CYCLE * N)
  // We'll calculate the base time (Start + Latency) first, then add cycles in the loop.
  const baseTimeMs = startTime.getTime() + fallAsleepMinutes * 60000;

  const cyclesToCalculate = [1, 2, 3, 4, 5, 6, 7];

  return cyclesToCalculate.map((cycleCount) => {
    const durationMinutes = cycleCount * cycleDurationMinutes;
    const rawTime = new Date(baseTimeMs + durationMinutes * 60000);

    // Rounding: Ceil to nearest 10 minutes
    // We get total minutes from epoch or just modify the Date object directly carefully.
    // Easier to round the 'minutes' component and let Date handle overflow.
    const minutes = rawTime.getMinutes();
    const roundedMinutes = Math.ceil(minutes / 10) * 10;

    // Create new date to avoid mutating rawTime if we used it elsewhere (though we don't here)
    const wakeUpTime = new Date(rawTime);
    wakeUpTime.setMinutes(roundedMinutes, 0, 0); // Sets rounded minutes, 0 seconds, 0 ms. 
    // Date object automatically handles minute overflow (e.g., setMinutes(60) increments hour)

    let label = "Okay";
    if (cycleCount === 5 || cycleCount === 6) label = "Best";
    if (cycleCount === 4) label = "Good";

    return {
      cycles: cycleCount,
      time: wakeUpTime,
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

  // Logic: TargetTime - (CYCLE * N) - LATENCY
  // Rounding: Floor to nearest 10 minutes

  const result = cyclesToCalculate.map((cycleCount) => {
    const cycleDurationMs = cycleCount * cycleDurationMinutes * 60000;
    const latencyMs = fallAsleepMinutes * 60000;

    // Calculate raw time
    const rawTime = new Date(wakeUpTime.getTime() - cycleDurationMs - latencyMs);

    // Rounding: Floor to nearest 10 minutes
    const minutes = rawTime.getMinutes();
    const roundedMinutes = Math.floor(minutes / 10) * 10;

    const bedTime = new Date(rawTime);
    bedTime.setMinutes(roundedMinutes, 0, 0);

    let label = "Okay";
    if (cycleCount === 5 || cycleCount === 6) label = "Best";
    if (cycleCount === 4) label = "Good";

    return {
      cycles: cycleCount,
      time: bedTime,
      formattedTime: formatTime(bedTime),
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
