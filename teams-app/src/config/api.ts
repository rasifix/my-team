export const API_CONFIG = {
  baseUrl: import.meta.env.PROD 
    ? 'https://teams-api-i5zh3.ondigitalocean.app/api' 
    : 'http://localhost:3000/api',
  defaultGroupId: '1', // Will be made configurable later
};