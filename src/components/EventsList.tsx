import type { Event } from '../types';
import { useState } from 'react';

interface EventsListProps {
  events: Event[];
  onEventClick?: (eventId: string) => void;
  onDelete?: (event: Event) => void;
}

export default function EventsList({ events, onEventClick, onDelete }: EventsListProps) {
  const [swipedEventId, setSwipedEventId] = useState<string | null>(null);
  if (events.length === 0) {
    return (
      <div className="text-gray-500 text-center py-8">
        <p>No events created yet. Click "Create Event" to get started.</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleTouchStart = (eventId: string, e: React.TouchEvent) => {
    const touch = e.touches[0];
    const startX = touch.clientX;
    
    const handleTouchMove = (moveEvent: TouchEvent) => {
      const moveTouch = moveEvent.touches[0];
      const diffX = startX - moveTouch.clientX;
      
      // Swipe left to reveal delete button
      if (diffX > 50) {
        setSwipedEventId(eventId);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      }
      // Swipe right to hide delete button
      else if (diffX < -50 && swipedEventId === eventId) {
        setSwipedEventId(null);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      }
    };
    
    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
    
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  const handleEventClick = (event: Event, e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('.delete-button')) {
      return;
    }
    onEventClick?.(event.id);
  };

  const handleDeleteClick = (event: Event, e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(event);
    setSwipedEventId(null);
  };

  const handleBackdropClick = () => {
    if (swipedEventId) {
      setSwipedEventId(null);
    }
  };

  return (
    <div className="space-y-4" onClick={handleBackdropClick}>
      {events.map((event) => {
        const hasSelections = event.teams.some(team => team.selectedPlayers?.length > 0);
        
        return (
          <div
            key={event.id}
            className="relative overflow-hidden border border-gray-200 rounded-lg"
          >
            <div
              onClick={(e) => handleEventClick(event, e)}
              onTouchStart={(e) => handleTouchStart(event.id, e)}
              className={`p-4 hover:shadow-md transition-all cursor-pointer ${
                swipedEventId === event.id ? '-translate-x-20' : 'translate-x-0'
              } duration-200`}
            >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{event.name}</h3>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-600">
                    📅 {formatDate(event.date)} at {event.startTime}
                  </p>
                  <p className="text-sm text-gray-600">
                    👥 {event.teams.length} {event.teams.length === 1 ? 'team' : 'teams'}
                  </p>
                  <p className="text-sm text-gray-600">
                    ✉️ {event.invitations.length} {event.invitations.length === 1 ? 'invitation' : 'invitations'}
                  </p>
                </div>
              </div>
              <div className="ml-4 flex items-start gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {hasSelections ? 'Selected' : 'Pending'}
                </span>
                {/* Delete button for desktop */}
                <button
                  onClick={(e) => handleDeleteClick(event, e)}
                  className="delete-button hidden sm:flex items-center justify-center w-8 h-8 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title="Delete event"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
            </div>

            {/* Delete button that appears on swipe */}
            <div 
              className={`absolute inset-y-0 right-0 flex items-center justify-center w-20 bg-red-600 transition-opacity duration-200 ${
                swipedEventId === event.id ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <button
                className="delete-button flex items-center justify-center w-full h-full text-white font-medium"
                onClick={(e) => handleDeleteClick(event, e)}
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
