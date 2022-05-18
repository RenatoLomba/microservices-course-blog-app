import axios from 'axios';

export const emitEvent = async (eventData: unknown) => {
  try {
    await axios.post('http://localhost:5005/events', eventData);
  } catch (error) {
    console.error('Error when emitting event to Event Bus Service', error);
  }
};
