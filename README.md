# Comments Application

A simple full-stack application comments with real-time updates, using React for the frontend and Node.js with Express and PostgreSQL for the backend via Docker containerization.

## Project Structure
```
.
├── README.md
├── backend
│   ├── app.js
│   ├── data
│   │   └── comments.json
│   ├── db
│   │   └── seed.js
│   ├── package.json
│   ├── routes
│   │   └── comments.js
│   ├── src
│   │   ├── app.ts
│   │   ├── config.ts
│   │   ├── controller
│   │   ├── db.ts
│   │   ├── docker-compose.yml
│   │   ├── route
│   │   ├── server.ts
│   │   └── service
│   └── tsconfig.json
└── frontend
    ├── index.html
    ├── package.json
    ├── src
    │   ├── App.tsx
    │   ├── components
    │   ├── main.tsx
    │   ├── pages
    │   └── vite-env.d.ts
    ├── tsconfig.json
    └── vite.config.ts
```

## Prerequisites

- Node.js + npm
- Docker

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start PostgreSQL using Docker:
```bash
docker compose up -d
```

4. Run database migrations to seed data:
```bash
node db/seed.js
```

5. Start the backend server:
```bash
ts-node src/server.ts
```

The backend server will be running on `http://localhost:3001`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend application will be running on `http://localhost:3000` but targeting `http://localhost:3001/api` via proxy

## API Endpoints

- `GET /api/comments` - Get all comments
- `POST /api/comments` - Create a new comment
- `PUT /api/comments/:id` - Update a comment
- `DELETE /api/comments/:id` - Delete a comment

## Technologies Used

### Frontend
- React
- TypeScript
- Vite
- Material-UI

### Backend
- Node.js
- Express
- TypeScript
- PostgreSQL
- Docker

### Verifying Database Updates

You can access the PostgreSQL comments table (in pgsql shell mode) via Docker by running:
```bash
docker exec -it comments_db psql -U user -d comments
```

Then, you should see:
```bash
comments=#
```

After which you can run the following query:

```bash
SELECT * FROM comments ORDER_BY created_at DESC;
```

You should see any new comments at the very top.

Alternatively, if you don't wish to be in pgsql shell mode, you can run:
```bash
docker exec -it comments_db psql -U user -d comments -c 'SELECT * FROM comments ORDER_BY created_at DESC'
```


### Follow-up

- If I had more time, I'd have considered robust validation, role-based access (admin vs. regular user) control, and maybe some text editing functionality so that users can italicize, bold, etc. Also, caching and pagination would be good optimizations.