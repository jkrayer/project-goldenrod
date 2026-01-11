# Project Goldenrod: Server

A Node/Express Rest API.

`npm run start`

## Database

PosgreSQL, Prisma

### users

| field    | type   |
| -------- | ------ |
| id       | int    |
| email    | string |
| userName | string |
| password |        |

### sessions

The games "at a glance". created_by is the referee for session, all other members are players

| field      | type                             |
| ---------- | -------------------------------- |
| id         | uuid primary key                 |
| name       | text not null                    |
| created_by | uuid references users(id)        |
| created_at | timestamp not null default now() |

### session_members

Stores which users can access this session and their role in it. Roles are referee and player but can be expanded in the future. May also serve as a reference to other data owned by both the user and the session such as character data.

| field      | type                                                |
| ---------- | --------------------------------------------------- |
| session_id | uuid references sessions(id) on delete cascade      |
| user_id    | uuid references users(id) on delete cascade         |
| role       | text not null check (role in ('referee', 'player')) |
| joined_at  | timestamp not null default now()                    |
|            | primary key (session_id, user_id)                   |
