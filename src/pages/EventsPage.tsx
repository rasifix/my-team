import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../hooks/useEvents';
import EventsList from '../components/EventsList';
import AddEventModal from '../components/AddEventModal';
import ConfirmDialog from '../components/ConfirmDialog';
import type { Team, Event } from '../types';
import { Card, CardBody, CardTitle } from '../components/ui';
import Button from '../components/ui/Button';

export default function EventsPage() {
  const navigate = useNavigate();
  const { events, addEvent, deleteEvent } = useEvents();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);

  const handleAddEvent = (eventData: { 
    name: string; 
    date: string; 
    startTime: string; 
    numberOfTeams: number; 
    maxPlayersPerTeam: number 
  }) => {
    // Create teams for the event
    const teams: Team[] = Array.from({ length: eventData.numberOfTeams }, (_, index) => ({
      id: crypto.randomUUID(),
      name: `Team ${index + 1}`,
      selectedPlayers: [], // Players will be assigned during selection
    }));

    const success = addEvent({
      name: eventData.name,
      date: eventData.date,
      startTime: eventData.startTime,
      maxPlayersPerTeam: eventData.maxPlayersPerTeam,
      teams,
      invitations: [],
    });

    if (success) {
      console.log('Event created successfully');
    } else {
      console.error('Failed to create event');
    }
  };

  const handleEventClick = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  const handleDeleteEvent = (event: Event) => {
    setEventToDelete(event);
    setIsConfirmDialogOpen(true);
  };

  const confirmDeleteEvent = () => {
    if (eventToDelete) {
      deleteEvent(eventToDelete.id);
      setEventToDelete(null);
    }
    setIsConfirmDialogOpen(false);
  };

  const cancelDeleteEvent = () => {
    setEventToDelete(null);
    setIsConfirmDialogOpen(false);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Events</h1>
        <p className="page-subtitle">
          View and manage soccer events and team selections.
        </p>
      </div>

      <Card>
        <CardBody>
          <div className="flex justify-between items-center mb-4">
            <CardTitle>All Events</CardTitle>
            <Button 
              variant="success"
              onClick={() => setIsModalOpen(true)}
            >
              Create Event
            </Button>
          </div>
          
          <EventsList 
            events={events} 
            onEventClick={handleEventClick}
            onDelete={handleDeleteEvent}
          />
        </CardBody>
      </Card>

      <AddEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddEvent}
      />

      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        title="Delete Event"
        message={`Are you sure you want to delete "${eventToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDeleteEvent}
        onCancel={cancelDeleteEvent}
        confirmButtonColor="red"
      />
    </div>
  );
}