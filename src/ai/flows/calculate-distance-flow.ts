'use server';
/**
 * @fileOverview A flow to calculate the distance between two locations.
 * - calculateDistance - Calculates the straight-line distance between two locations.
 * - CalculateDistanceInput - Input schema for the flow.
 * - CalculateDistanceOutput - Output schema for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import axios from 'axios';

// 1. Define Input and Output Schemas with Zod
const CalculateDistanceInputSchema = z.object({
  origin: z.string().describe('The starting location (e.g., city name, address).'),
  destination: z.string().describe('The ending location (e.g., city name, address).'),
});
export type CalculateDistanceInput = z.infer<typeof CalculateDistanceInputSchema>;

const CalculateDistanceOutputSchema = z.object({
  distanceKm: z.number().optional().describe('The calculated straight-line distance in kilometers.'),
  error: z.string().optional().describe('An error message if the calculation failed.'),
});
export type CalculateDistanceOutput = z.infer<typeof CalculateDistanceOutputSchema>;


// 2. Define a Geocoding Tool
const geocodeTool = ai.defineTool(
  {
    name: 'getLocationCoordinates',
    description: 'Get the latitude and longitude for a given location name.',
    inputSchema: z.object({ location: z.string() }),
    outputSchema: z.object({
      lat: z.number(),
      lon: z.number(),
    }),
  },
  async ({ location }) => {
    try {
      // Using a free, public geocoding API (Nominatim)
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: location,
          format: 'json',
          limit: 1,
        },
        headers: { 'User-Agent': 'TabdilaApp/1.0' }
      });

      if (response.data && response.data.length > 0) {
        return {
          lat: parseFloat(response.data[0].lat),
          lon: parseFloat(response.data[0].lon),
        };
      }
      throw new Error('Location not found.');
    } catch (error) {
      console.error(`Geocoding error for ${location}:`, error);
      throw new Error(`Could not find coordinates for ${location}.`);
    }
  }
);


// Haversine formula to calculate distance between two points on Earth
function getHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
}


// 3. Define the Main Flow
const calculateDistanceFlow = ai.defineFlow(
  {
    name: 'calculateDistanceFlow',
    inputSchema: CalculateDistanceInputSchema,
    outputSchema: CalculateDistanceOutputSchema,
  },
  async ({ origin, destination }) => {
    try {
      // Get coordinates for both locations in parallel
      const [originCoords, destinationCoords] = await Promise.all([
        geocodeTool({ location: origin }),
        geocodeTool({ location: destination }),
      ]);
      
      if (!originCoords || !destinationCoords) {
        return { error: 'Could not determine coordinates for one or both locations.' };
      }

      // Calculate the distance
      const distance = getHaversineDistance(
        originCoords.lat,
        originCoords.lon,
        destinationCoords.lat,
        destinationCoords.lon
      );

      return { distanceKm: distance };

    } catch (e: any) {
        console.error("Error in calculateDistanceFlow: ", e);
        return { error: e.message || 'An unexpected error occurred.' };
    }
  }
);


// 4. Export a wrapper function for the client
export async function calculateDistance(input: CalculateDistanceInput): Promise<CalculateDistanceOutput> {
  return calculateDistanceFlow(input);
}
