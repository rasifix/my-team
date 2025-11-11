# API Migration Plan: From localStorage to teams-api

## Overview
This document outlines the step-by-step migration from localStorage-based storage in the teams-app to the backend teams-api. The migration preserves all existing functionality while moving to a scalable backend architecture.

## Prerequisites
- teams-api running on port 3000
- teams-app running on port 5173
- MongoDB instance available (via Docker)

## Phase 1: Setup and Preparation
An export of the existing data is not needed. I have already saved my data.

### 1.1 Create API Configuration in teams-app
```typescript
// teams-app/src/config/api.ts
export const API_CONFIG = {
  baseUrl: process.env.NODE_ENV === 'production' 
    ? 'https://your-api-domain.com/api' 
    : 'http://localhost:3000/api',
  defaultGroupId: '1', // Will be made configurable later
};
```

### 1.2 Update Vite Config for Proxy
```typescript
// teams-app/vite.config.ts
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Follow instruction to use default port
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
})
```

## Phase 2: Create API Client

### 2.1 Implement API Client Service
```typescript
// teams-app/src/services/apiClient.ts
import { API_CONFIG } from '../config/api';

class ApiClient {
  private baseUrl: string;
  private groupId: string;

  constructor() {
    this.baseUrl = API_CONFIG.baseUrl;
    this.groupId = API_CONFIG.defaultGroupId;
  }

  async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }

    return response.json();
  }

  getGroupEndpoint(path: string): string {
    return `/groups/${this.groupId}${path}`;
  }
}

export const apiClient = new ApiClient();
```

## Phase 3: Update Type Definitions
The type definitions should already be aligned. The groupId does not need to be added on the client side. As we run in the context of a "group", all events / players / ... are
part of that group anyways.

## Phase 4: Migrate Services Layer

### 4.1 Update Player Service
```typescript
// teams-app/src/services/playerService.ts
import { apiClient } from './apiClient';
import type { Player } from '../types';

export async function getPlayers(): Promise<Player[]> {
  return apiClient.request<Player[]>(
    apiClient.getGroupEndpoint('/members?role=player')
  );
}

export async function addPlayer(playerData: Omit<Player, 'id' | 'groupId'>): Promise<Player> {
  return apiClient.request<Player>(
    apiClient.getGroupEndpoint('/members'),
    {
      method: 'POST',
      body: JSON.stringify({ ...playerData, role: 'player' })
    }
  );
}

export async function updatePlayer(id: string, playerData: Partial<Player>): Promise<Player> {
  return apiClient.request<Player>(
    apiClient.getGroupEndpoint(`/members/${id}`),
    {
      method: 'PUT',
      body: JSON.stringify(playerData)
    }
  );
}

export async function deletePlayer(id: string): Promise<void> {
  return apiClient.request<void>(
    apiClient.getGroupEndpoint(`/members/${id}`),
    { method: 'DELETE' }
  );
}
```

### 4.2 Update Trainer Service
```typescript
// teams-app/src/services/trainerService.ts
import { apiClient } from './apiClient';
import type { Trainer } from '../types';

export async function getTrainers(): Promise<Trainer[]> {
  return apiClient.request<Trainer[]>(
    apiClient.getGroupEndpoint('/members?role=trainer')
  );
}

export async function addTrainer(trainerData: Omit<Trainer, 'id' | 'groupId'>): Promise<Trainer> {
  return apiClient.request<Trainer>(
    apiClient.getGroupEndpoint('/members'),
    {
      method: 'POST',
      body: JSON.stringify({ ...trainerData, role: 'trainer' })
    }
  );
}
```

### 4.3 Update Event Service
```typescript
// teams-app/src/services/eventService.ts
import { apiClient } from './apiClient';
import type { Event } from '../types';

export async function getEvents(): Promise<Event[]> {
  return apiClient.request<Event[]>(
    apiClient.getGroupEndpoint('/events')
  );
}

export async function addEvent(eventData: Omit<Event, 'id' | 'groupId'>): Promise<Event> {
  return apiClient.request<Event>(
    apiClient.getGroupEndpoint('/events'),
    {
      method: 'POST',
      body: JSON.stringify(eventData)
    }
  );
}

export async function updateEvent(id: string, eventData: Partial<Event>): Promise<Event> {
  return apiClient.request<Event>(
    apiClient.getGroupEndpoint(`/events/${id}`),
    {
      method: 'PUT',
      body: JSON.stringify(eventData)
    }
  );
}

export async function deleteEvent(id: string): Promise<void> {
  return apiClient.request<void>(
    apiClient.getGroupEndpoint(`/events/${id}`),
    { method: 'DELETE' }
  );
}
```

### 4.4 Update Shirt Service
```typescript
// teams-app/src/services/shirtService.ts
import { apiClient } from './apiClient';
import type { ShirtSet } from '../types';

export async function getShirtSets(): Promise<ShirtSet[]> {
  return apiClient.request<ShirtSet[]>(
    apiClient.getGroupEndpoint('/shirtsets')
  );
}

export async function addShirtSet(shirtData: Omit<ShirtSet, 'id' | 'groupId'>): Promise<ShirtSet> {
  return apiClient.request<ShirtSet>(
    apiClient.getGroupEndpoint('/shirtsets'),
    {
      method: 'POST',
      body: JSON.stringify(shirtData)
    }
  );
}
```

## Phase 5: Data Migration
No data migration needed. Will be done manually.

## Phase 6: Update Hooks

### 6.1 Hooks Remain Mostly Unchanged
Since hooks already use the service layer, they require minimal changes. Only error handling needs updates:

```typescript
// teams-app/src/hooks/usePlayers.ts
const handleAddPlayer = async (playerData: Omit<Player, 'id' | 'groupId'>): Promise<boolean> => {
  try {
    await playerService.addPlayer(playerData);
    await loadPlayers(); // Refresh from API
    setError(null);
    return true;
  } catch (err) {
    setError('Failed to save player to server');
    console.error('Error adding player:', err);
    return false;
  }
};
```

## Phase 7: Remove localStorage Dependencies

### 7.1 Clean Up localStorage Utils
```typescript
// teams-app/src/utils/localStorage.ts
// Remove all CRUD operations
// Keep only exportAllData() and importDataFromJSON() for migration support
// These can be removed after successful migration
```

### 7.2 Remove Migration Code
```typescript
// Delete teams-app/src/utils/migrations.ts
// This is no longer needed with API backend
```

### 7.3 Update App Initialization
```typescript
// teams-app/src/App.tsx
function App() {
  useEffect(() => {
    // Remove localStorage migration logic
    // Add API health check instead
    fetch('/api/health')
      .then(response => {
        if (!response.ok) {
          console.warn('API not available, some features may not work');
        }
      })
      .catch(error => {
        console.warn('API connection failed:', error);
      });
  }, []);

  // Rest remains the same
}
```

## Phase 8: Update Development Workflow

### 8.1 Update Package Scripts
```json
// teams-app/package.json
{
  "scripts": {
    "dev": "npm run check-api && vite --port 5173",
    "check-api": "curl -f http://localhost:3000/health || (echo 'API not running! Start it with: cd ../teams-api && npm run dev' && exit 1)",
    "dev:api": "cd ../teams-api && npm run dev",
    "dev:full": "concurrently \"npm run dev:api\" \"npm run dev\""
  }
}
```

### 8.2 Add Concurrently for Parallel Development
```bash
cd teams-app
npm install --save-dev concurrently
```

## Phase 9: Update UI Components

### 9.1 Remove Import/Export from Header
```typescript
// teams-app/src/components/Header.tsx
// Remove import/export functionality since data is now managed by API
// Keep only navigation functionality
```

### 9.2 Update Error Handling in Components
Update error messages to reflect server communication:
- "Failed to save" → "Failed to save to server"
- "Failed to load" → "Failed to load from server"

## Phase 10: Testing and Validation

### 10.1 Test Each Service
1. Start API: `npm run dev` in teams-api
2. Start frontend with proxy: `npm run dev` in teams-app  
3. Test each CRUD operation for:
   - Players
   - Trainers
   - Events
   - Shirt Sets

### 10.2 Test Fairness Algorithm
Verify the selection algorithm still works correctly with API data:
- Previous event participation tracking
- Fair team distribution
- Player statistics

### 10.3 Mobile Responsiveness
Test on mobile devices (minimum iPhone SE 375px width) to ensure API calls don't affect UI performance.

## Phase 11: Production Considerations

### 11.1 Environment Variables
```bash
# teams-app/.env.production
VITE_API_BASE_URL=https://your-api-domain.com/api
```

### 11.2 Error Boundaries
Add React error boundaries to handle API failures gracefully.

### 11.3 Loading States
Ensure all components show appropriate loading states during API calls.

## Rollback Strategy

1. Keep localStorage branch: Create `feature/localStorage-backup` branch before migration
2. Feature flags: Consider implementing feature flags to toggle between localStorage and API
3. Data export: Always maintain ability to export data as JSON backup

## Post-Migration Cleanup

1. Remove localStorage utility functions
2. Remove migration-related code
3. Update documentation
4. Remove unused dependencies
5. Clean up type definitions

## Success Criteria

- [ ] All CRUD operations work through API
- [ ] Mobile UI performance maintained
- [ ] All existing features preserved
- [ ] Error handling improved
- [ ] Development workflow streamlined

## Notes

- Follow mobile-first responsive design principles throughout migration
- Maintain TypeScript strict mode compliance
- Keep error handling user-friendly
