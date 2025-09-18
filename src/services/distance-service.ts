import distances from '@/lib/iran-distances.json';

type DistanceData = {
    [origin: string]: {
        [destination: string]: number;
    }
}

const distanceData: DistanceData = distances;

/**
 * Gets the road distance between two provincial capitals in Iran.
 * @param origin The starting city.
 * @param destination The destination city.
 * @returns The distance in kilometers, or null if not found.
 */
export function getRoadDistance(origin: string, destination: string): number | null {
    if (distanceData[origin] && typeof distanceData[origin][destination] !== 'undefined') {
        return distanceData[origin][destination];
    }
    // Also check the other way around
    if (distanceData[destination] && typeof distanceData[destination][origin] !== 'undefined') {
        return distanceData[destination][origin];
    }
    return null;
}
