# Project Goldenrod: Server

A Node/Express Rest API.

`npm run start`

## Database

PosgreSQL, Prisma

### users

| field    | type                  |
| -------- | --------------------- |
| id       | int                   |
| email    | string                |
| userName | string                |
| password |                       |
| role     | admin \| gm \| player |

### games

| field       | type |
| ----------- | ---- |
| id          | int  |
| name        | text |
| description | text |
