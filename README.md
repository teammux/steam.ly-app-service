# Steam.ly-app-service
Service used to handle user client activity and dispatch activity events to an external event handler.

## Features
Handles client interactions with Steam.ly
- login/logout
- click interactions
- provides user profile data points used for recommendations and analytics

## Data Generation Scripts
- data/userdata.js

This script generates a JSON file containing all randomly generated static user data
```
[usage] node userdata.js <NUMBER_OF_USERS_TO_GENERATE>
```
