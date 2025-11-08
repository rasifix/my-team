// Migration to move startTime from event level to team level
export function migrateStartTimeToTeam(): void {
  try {
    const eventsJson = localStorage.getItem('events');
    if (!eventsJson) {
      console.log('No events to migrate');
      return;
    }

    const events = JSON.parse(eventsJson);
    let migratedCount = 0;

    const migratedEvents = events.map((event: any) => {
      // Check if teams already have startTime
      if (event.teams && event.teams.length > 0 && event.teams[0].startTime !== undefined) {
        return event; // Already migrated
      }

      // Get startTime from event level
      const eventStartTime = event.startTime || '10:00'; // Default if missing

      // Add startTime to all teams
      const migratedTeams = event.teams?.map((team: any) => ({
        ...team,
        startTime: eventStartTime,
      })) || [];

      migratedCount++;
      
      // Remove startTime from event level
      const { startTime, ...eventWithoutStartTime } = event;
      
      return {
        ...eventWithoutStartTime,
        teams: migratedTeams,
      };
    });

    // Save migrated events back to localStorage
    localStorage.setItem('events', JSON.stringify(migratedEvents));
    console.log(`Start time migration completed: ${migratedCount} event(s) migrated`);
  } catch (error) {
    console.error('Start time migration failed:', error);
  }
}
