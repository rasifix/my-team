import type { Event, Trainer } from '../types';
import EventCard from './EventCard';

interface EventsListProps {
  events: Event[];
  trainers?: Trainer[];
  onEventClick?: (eventId: string) => void;
}

export default function EventsList({ events, trainers = [], onEventClick }: EventsListProps) {
  if (events.length === 0) {
    return (
      <div className="text-gray-500 text-center py-8">
        <p>No events created yet. Click "Create Event" to get started.</p>
      </div>
    );
  }

  const handleEventClick = (eventId: string) => {
    onEventClick?.(eventId);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          trainers={trainers}
          onClick={handleEventClick}
        />
      ))}
    </div>
  );
}
