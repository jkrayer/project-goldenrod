# Sockets

Read Socket.io Docs:

1. Return errors
2. Rooms

## API

1. OnConnect
   1. Success: emit authenticated
   2. Fail: emit error
2. Join Room
   1. Success: emit joined to everyone
   2. Fail: emit error
3. Leave Room
   1. Always emit left

In memory game storage

```js
const rm = `${gameName}-${gameId}`;

const ROOMS = Map<rm, Map<userId, SessionMember>>
```

## on ("connect") (?token=jwt)

Verify token.

### Success

`emit("authentication:success", { message: "Authentication successful" })`

### Failure

`emit("authentication:failure", { message: "Authentication failed" })`

## on ("game:join") ({gameName, gameId, userName })

Join a game. Technically the user should never be presented games they can't join but there's always a chance of permissions being revoked or malicious users.

roomName = `gameName-gameId`

### Success

`emit("game:joined:success", { message: "${userName, room: } joined the game." })`

### Failure

`emit("game:join:failure", { messages: "Access Denied: User is not a member of this game." })`

## on"game:leave" ()

Update the user in `ROOMS`

`emit("game:leave:success", { message: `User`, room: "", });`

## Client

1. Connect
   1. Success (2)
   2. Fail (stop)
2. Join Room
   1. Success (3)
   2. Fail (stop)
3. Listen for Room Events
   1. Joins
   2. Leaves
   3. ... (other events)
4. Logout
   1. Leave Room
   2. Disconnect

## "connect" (?token=jwt)

API verifies token.

Success: server emits "authentication:success" event with { userId }

Failure: server emits "authentication:failure" event; UI should log the user out

## "game:join" (gameName, gameId, userId)

API verifies user access to game

Success: server emits "game:join:success" (gameId, ROOMS[rm], `${useName} joined.`)

Failure: server emits "game:join:failure" with message { error: "Access Denied: User is not a member of this game." }

UI should show error and stop further loading

## "game:leave" (gameName, gameId, userId)

API verifies user access to game

Success: server emits "game:left" event with { ... }
