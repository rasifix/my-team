# Teams API

Express.js + TypeScript backend for the My Teams application.

## Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB 4.4+ (local installation or cloud instance)

### Installation
```bash
npm install
```

### Environment Configuration
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Configure your MongoDB connection in `.env`:
   ```bash
   # For local development
   MONGODB_HOST=localhost
   MONGODB_PORT=27017
   MONGODB_DATABASE=teams-dev
   
   # For production or cloud MongoDB
   MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/teams
   ```

### Database Setup
The API will automatically:
- Connect to MongoDB on startup
- Create required collections (`people`, `events`, `shirt-sets`)
- Create optimized indexes for performance

### Development
```bash
npm run dev
```
This will start the server on http://localhost:3000 with hot reload enabled.

### Build
```bash
npm run build
```

### Production
```bash
npm start
```

## API Endpoints

### Players
* `GET /api/players` - Get all players
* `GET /api/players/:id` - Get a player by ID
* `POST /api/players` - Create a new player
* `PUT /api/players/:id` - Update an existing player
* `DELETE /api/players/:id` - Delete a player

### Events
* `GET /api/events` - Get all events
* `GET /api/events/:id` - Get an event by ID
* `POST /api/events` - Create a new event
* `PUT /api/events/:id` - Update an existing event
* `DELETE /api/events/:id` - Delete an event
* `PUT /api/events/:id/players` - Upsert invitations for an event
* `PUT /api/events/:id/players/:player_id/status` - Update invitation status
* `PUT /api/events/:id/selection` - Update player selection for teams

### Health Check
* `GET /health` - Check if the API and database are running

## Database Schema

The API uses MongoDB with three collections:

### Collections
- `people` - Unified collection for players and trainers
- `events` - Events with embedded teams and invitations  
- `shirt-sets` - Shirt sets with embedded shirts

### Environment Variables
| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `MONGODB_URL` | Full MongoDB connection string | - | `mongodb+srv://user:pass@cluster.net/db` |
| `MONGODB_HOST` | MongoDB host | `localhost` | `localhost` |
| `MONGODB_PORT` | MongoDB port | `27017` | `27017` |
| `MONGODB_DATABASE` | Database name | `teams` | `teams-dev` |
| `MONGODB_USERNAME` | Username for authentication | - | `teams-user` |
| `MONGODB_PASSWORD` | Password for authentication | - | `secure-password` |
| `PORT` | API server port | `3000` | `8080` |

## Data Models

### Player
```json
{
  "id": "string",
  "firstName": "string",
  "lastName": "string",
  "birthYear": "number",
  "level": "number (1-5)"
}
```

### Event
```json
{
  "id": "string",
  "name": "string",
  "date": "string (ISO date)",
  "startTime": "string",
  "maxPlayersPerTeam": "number",
  "teams": [Team],
  "invitations": [Invitation]
}
```

### Team
```json
{
  "id": "string",
  "name": "string",
  "strength": "number (1-5)",
  "selectedPlayers": ["string (player IDs)"]
}
```

### Invitation
```json
{
  "id": "string",
  "playerId": "string",
  "status": "open | accepted | declined"
}
```

## Technology Stack
- Express.js - Web framework
- TypeScript - Type safety
- MongoDB - Document database
- tsx - TypeScript execution and hot reload
- dotenv - Environment variable management