# Steam.ly AppService API
This document outlines all functions exposed by the Steam.ly AppService.

## User Interface
This section defines the interface functionality for all User-driven activity

### /review
*FUTURE: Planned for V2*

GET
[options] - JSON object
- review_id (Number)
POST
[options] - JSON object
- rating (Number: 1-5)
- review_text (String: can be null)

### /user
GET
[options] - JSON object
- name (String: cannot be null)

### /createuser
POST
[options] - JSON object
- username (String: cannot be null)

### /purchase
POST
[options] - JSON object
- game_id (Number)
- price (Number)

### /gameinfo
GET
[options] - JSON object
- name (String: cannot be null)

## Content Interface
This section defines the interface functionality for all Content data source activity

### /search
*FUTURE: Planned for V2*

POST
[options] - JSON object
- type (ENUM: name, category, publisher, max_price, min_rating)

## Notification Interface

This section outlines outputs from this service that other services might be interested in listening for

### /notifycreateuser
POST
[user_data] - JSON object
- user_id (Number)

### /notifygamepurchase
POST
[game_data] - JSON object
- game_id (Number)
- user_id (Number)
- purchase_price (Number: decimal price)

### /notifyclick
POST
[session_data] - JSON object
- game_id (Number)

### /notifygamesession
*FUTURE: Planned for V2*

POST
[session_data] - JSON object
- elapsed_time (Number: seconds)

### /notifypagevisitsession
*FUTURE: Planned for V2*

POST
[session_data] - JSON object
- elapsed_time (Number: seconds)

## Metrics Interface

This section defines the interface functionality available for accessing metrics and instrumentation

### /usersignups
GET
[options] - JSON object
- category (ENUM: NONE, FPS, ACTION, RPG)
- start_date
- end_date

### /averagesearchtime
*FUTURE: Planned for V2*

GET
[options] - JSON object
- start_date
- end_date
- category (ENUM: NONE, ...)
- granularity (ENUM: day, week, month, year)

### /averagesearchrequests
*FUTURE: Planned for V2*

GET
[options] - JSON object
- start_date
- end_data
- category (ENUM: NONE, ...)
- granularity (ENUM: day, week, month, year)

### /trendingsearches
*FUTURE: Planned for V2*

GET
[options] - JSON object
- category (ENUM: NONE, FPS, ACTION, RPG)
