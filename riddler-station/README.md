## riddler station
Connected to various arduino hardware systems by USB, Each station instance manages several different riddles in the arena.

### configuration
The Station requires some configuration from the environment. These can be set in the environment variables of the executing process, or in a designated ```.env``` file at the root of this project. Here are the required configuration keys, along with suggested default values for development:
```properties
riddle1_port=5000
```
### setup for development
in the ```riddler-station``` folder:
 - create a file named ```.env``` with above configurations
 - execute the following:
```bash
npm install 
npm start 
```

### Setup on Raspberry Pi

Download NOOBS from https://www.raspberrypi.org/downloads/
Download formmater from https://www.sdcard.org/downloads/formatter_4/ (windows or mac)


-WIP-
