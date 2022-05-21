import axios from 'axios';

const eventBusService = axios.create({
  baseURL: 'http://event-bus-clusterip-srv:5005',
});

interface IEvent {
  type: string;
  data: unknown;
}

export const getEvents = async () => {
  let result: IEvent[] | null = null;

  try {
    const { data } = await eventBusService.get<IEvent[]>('events');

    result = data;
  } catch (error) {
    console.log('Error on getting events from Event Bus', error);
  }

  return result;
};
