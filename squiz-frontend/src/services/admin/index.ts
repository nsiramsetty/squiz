import Axios from 'axios';
import { HOST_URL } from '../../Config/constants.js';

export type GlobalStats = {
  five_star_reviews?: number;
  free_guided_meditations?: number;
  meditators?: number;
  meditators_now?: number;
  meditators_today?: number;
  teachers?: number;
  timestamp?: number;
  activities_locations?: { lat: number; lon: number }[];
};

export function getGlobalStats(): Promise<GlobalStats> {
  return Axios.get(`${HOST_URL}/apiAdminGlobalStats/request/stats`).then(
    resp => {
      return resp.data as GlobalStats;
    }
  );
}
