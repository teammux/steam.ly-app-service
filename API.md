# Steam.ly AppService API
This document outlines all functions exposed by the Steam.ly AppService.

## User Interface
This section defines the interface functionality for all User-driven activity

### /review

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
POST
[options] - JSON object
- type (ENUM: name, category, publisher, max_price, min_rating)

## EventHistory Interface
### /recordclick
POST
[session_data] - JSON object
- game_id (Number)

### /recordgamesession
POST
[session_data] - JSON object
- elapsed_time (Number: seconds)

### /recordpagevisitsession
POST
[session_data] - JSON object
- elapsed_time (Number: seconds)
