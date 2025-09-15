import axios from 'axios';

// Create an Axios instance configured for your backend API
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE || 'https://spaces-by-fanpit-x3kc.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in headers
apiClient.interceptors.request.use(
  (config) => {
    // Check if window is defined to ensure this code runs only on the client-side
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Define the structure of a Space object based on our backend schema
export interface Space {
  _id: string;
  name: string;
  description: string;
  address: string;
  capacity: number;
  amenities: string[];
  images: string[];
  pricing: {
    hourlyRate?: number;
    dailyRate?: number;
  };
}

// API functions related to spaces
export const spacesAPI = {
  /**
   * Fetches all spaces from the backend.
   * @returns {Promise<Space[]>} A promise that resolves to an array of spaces.
   */
  async getAllSpaces(): Promise<Space[]> {
    try {
      const response = await apiClient.get('/spaces');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch spaces:', error);
      return [];
    }
  },

  /**
   * Fetches a single space by its ID.
   * @param {string} id The ID of the space to fetch.
   * @returns {Promise<Space>} A promise that resolves to the space object.
   */
  async getById(id: string): Promise<Space> {
    const response = await apiClient.get(`/spaces/${id}`);
    return response.data;
  },

  /**
   * Creates a new space.
   * @param {Omit<Space, '_id'>} spaceData The data for the new space.
   * @returns {Promise<Space>} A promise that resolves to the newly created space object.
   */
  async create(spaceData: Partial<Omit<Space, '_id'>>): Promise<Space> {
    const response = await apiClient.post('/spaces', spaceData);
    return response.data;
  },
};

// API functions related to reservations
export const reservationsAPI = {
  /**
   * Fetches all reservations.
   * @returns {Promise<any[]>} A promise that resolves to an array of reservations.
   */
  async getAll(): Promise<any[]> {
    const response = await apiClient.get('/reservations');
    return response.data;
  },

  /**
   * Fetches a single reservation by its ID.
   * @param {string} id The ID of the reservation to fetch.
   * @returns {Promise<any>} A promise that resolves to the reservation object.
   */
  async getById(id: string): Promise<any> {
    const response = await apiClient.get(`/reservations/${id}`);
    return response.data;
  },

  /**
   * Updates a reservation.
   * @param {string} id The ID of the reservation to update.
   * @param {object} data The data to update.
   * @returns {Promise<any>} A promise that resolves to the updated reservation object.
   */
  async update(id: string, data: any): Promise<any> {
    const response = await apiClient.patch(`/reservations/${id}`, data);
    return response.data;
  },

  /**
   * Creates a new reservation.
   * @param {object} reservationData The data for the new reservation.
   * @returns {Promise<any>} A promise that resolves to the new reservation object.
   */
  async create(reservationData: { spaceId: string; userId: string; startTime: string; endTime: string }): Promise<any> {
    const response = await apiClient.post('/reservations', reservationData);
    return response.data;
  },
};

// API functions related to check-ins
export const issuesAPI = {
  async create(issueData: { bookingCode: string; issue: string; priority: string }): Promise<any> {
    const response = await apiClient.post('/issues', issueData);
    return response.data;
  },
  async getAll(): Promise<any[]> {
    const response = await apiClient.get('/issues');
    return response.data;
  },
};

export const checkinsAPI = {
  /**
   * Creates a new check-in.
   * @param {object} checkinData The data for the new check-in.
   * @returns {Promise<any>} A promise that resolves to the new check-in object.
   */
  async create(checkinData: { reservation: string; user: string }): Promise<any> {
    const response = await apiClient.post('/checkins', checkinData);
    return response.data;
  },
};

