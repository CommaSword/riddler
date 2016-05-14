## riddler back office
installed on a single server in the larp's LAN, and connects to all the stations for monitoring and command.

### configuration
The back office requires some configuration from the environment. These can be set in the environment variables of the executing process, or in a designated ```.env``` file at the root of this project. Here are the required configuration keys, along with suggested default values for development:
```properties
node_red_port=8000
riddle1_get_url=http://127.0.0.1:5000/data
riddle1_set_timeout_value_url=http://127.0.0.1:5000/timeout_value
riddle1_set_time_since_press_url=http://127.0.0.1:5000/time_since_press
```
### setup for development
in the ```riddler-station``` folder:
 - create a file named ```.env``` with above configurations
 - execute the following:
```bash
npm install 
npm start 
```

### Setup on Larp server

-WIP-
