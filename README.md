# Steam.ly-app-service
Service used to handle user client activity and dispatch activity events to an external event handler.

## Features
Handles client interactions with Steam.ly
- login/logout (*future*)
- click interactions
- provides user profile data points used for recommendations and analytics
- data generation scripts

## User Event Simulator
- sim/index.js

This script is used to simulate real-time User Events and is meant to be started and run in the background to test the functionality of the service
```
[usage] node ${path.basename(__filename)} <EVENT_BURST_INTERVAL> <EVENT_BURST_QUANTITY>

  EVENT_BURST_INTERVAL: interval in milliseconds to send a batch of events

  EVENT_BURST_QUANTITY: amount of events to send at each burst interval
```

## Data Generation Scripts
- data/userdata.js

This script generates a JSON file containing all randomly generated static user data
```
[usage] node userdata.js <NUMBER_OF_USERS_TO_GENERATE>
```

- data/clickprofiledata.js

This script generates a JSON file containing all randomly generated static click profile data
```
[usage] node clickprofiledata.js <NUMBER_OF_USER_CLICK_PROFILES_TO_GENERATE>
```
