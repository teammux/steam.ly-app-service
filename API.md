# Steam.ly AppService API
This document outlines all functions exposed by the Steam.ly AppService.

## User Interface
This section defines the interface functionality for all User-driven activity and data.

### /user
GET
[options] - JSON object
- username: (String: cannot be null)

[returns] - JSON object
- user:
```{
  id: (Number),
  username: (String),
  preferences: (ENUM: NONE, FPS, ACTION, RPG),
  clicks: (Array of clicks separated by category)
    {
      category: (ENUM: NONE, FPS, ACTION, RPG)
        [
          total_impressions: (Number),
          total_clicks: (Number),
          recommended_clicks: (Number)
        ], ...
    }
}
```

### /listofusers
GET
[options] - JSON object
- category: (ENUM: NONE, FPS, ACTION, RPG)

[returns] - JSON object
- users: (Array of user objects)
```
[
  {
    id: (Number),
    username: (String),
    preferences: (ENUM: NONE, FPS, ACTION, RPG),
    clicks: (Array of clicks separated by category)
      {
        category: (ENUM: NONE, FPS, ACTION, RPG)
          [
            total_impressions: (Number),
            total_clicks: (Number),
            recommended_clicks: (Number)
          ], ...
      }
  }, ...
]
```

### /createuser
POST
[options] - JSON object
- username (String: cannot be null),
- preferences: (ENUM: NONE, FPS, ACTION, RPG)

[returns] - Nothing

### /login
GET
[options] - Query parameters
- username (String: cannot be null)
- password (String: cannot be null)

[returns] - HTTP status code/JSON object
- status: 200 OK
- recommendation: (Number)

### /logout
GET
[options] - Query parameters
- username (String: cannot be null)

[returns] - HTTP status code
- status: 200 OK

## Notification Interface

This section outlines outputs from this service that other services might be interested in listening for.

### /notifycreateuser
POST
[user_data] - JSON object
- user_id (Number)

[returns] - Nothing

### /notifyclick
POST
[session_data] - JSON object
- game_id (Number)
- user_id (Number)
- is_recommended_game (Boolean)

[returns] - Nothing

event = {
  type: 'click',
  date: (Javascript Date format)
  user_id: (Number)
  game_id: (Number)
  is_recommended_game: (Boolean)
}

## Metrics Interface

This section defines the interface functionality available for accessing metrics and instrumentation.

### /usersignups
GET
[options] - JSON object
- category (ENUM: NONE, FPS, ACTION, RPG)
- start_date
- end_date

### /userclicks
GET
[options] - JSON object
- is_recommended (Boolean)

### /userpreferencecounts
GET
[options] - Nothing

[returns] - JSON object
- none (Number)
- action (Number)
- rpg (Number)
- fps (Number)
