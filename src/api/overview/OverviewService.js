import { BASE_URL, headers } from '../config/Config';
// TODO: put api calls from config
export default class OverviewStatsApi {
  static getOverviewStats = userobject => fetch(`${BASE_URL}/api/dashboard/userData`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ userName: userobject })
  }).then(response => response.json())
}
