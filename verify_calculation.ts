
import { calculateBedTimes, formatTime } from './app/utils/sleep';

const wakeUpTime = new Date();
wakeUpTime.setHours(7, 0, 0, 0); // 7:00 AM
// Determine if we need to add a day (simulating page.tsx logic approximately)
if (wakeUpTime < new Date()) {
    wakeUpTime.setDate(wakeUpTime.getDate() + 1);
}

const fallAsleepMinutes = 15;
const cycleDurationMinutes = 60; // User said 60

console.log(`Calculating Bed Times for Wake Up: ${wakeUpTime.toLocaleString()}`);
console.log(`Fall Asleep: ${fallAsleepMinutes} min, Cycle Duration: ${cycleDurationMinutes} min`);

const results = calculateBedTimes(wakeUpTime, fallAsleepMinutes, cycleDurationMinutes);

results.forEach(r => {
    console.log(`Cycles: ${r.cycles} | Bed Time: ${r.formattedTime} | Raw: ${r.time.toLocaleString()}`);
});
