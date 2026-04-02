# Project Goldenrod (may be re-named)

A theater-of-the-mind VTT

Modern RPGs and the VTTs that support them have a

1. Micro-focused on movement and actions.
2. Combats fewer than 4 rounds
3. Eschews un-necessary tools
   1. Video and Chat can be provided by discord
   2. Battle maps by Owlbear Rodeo

## Architecture

### /backend

The server that supports the real-time collaborative version.

### /frontend

All the feature of /tools plus real time collaborative features for groups.

### /shared

Shared typescript types and unit tested functions.

### /tools

Free D.M. tools based on the trackers offered by AD&D and OSE.

Published at jkrayer/project(-/\_)goldenrod. A U.I. only React SPA using the browser's local storage for persistence.

### /ui

Shared React components.

## Architecture Diagram

![Architecture Diagram](./docs/Architecture_0001.jpg "Architecture Diagram")

## Initial Component Lib Plan

```
├── components
│   ├── Form
│   ├── Button
│   ├── Email Input
│   ├── Text Input
│   ├── Text Area
│   ├── Password  Input
│   ├── Table (Lobby / Waiting Room)
│   ├── GM Card
│   ├── PLayer Card
│   └── Toast
│   └── ...
└──
```

I know I'll need more components for Dice Roller and Handout Management. Will document those when the time comes.

## Initial State Plan

```
├── state
│   ├── Lobby
│   ├── Game
│   └── ...
└──
```

## Stack

### UI

React, React Router, Redux
