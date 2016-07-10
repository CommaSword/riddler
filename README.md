## riddler
LARP arena IoT

### Overview
The riddler system is made of two code projects, each with different role and configurations:
 - the station project is installed on multiple Pi machines in the larp arena, connected to various arduino hardware systems by USB. each station manages several different riddles in the arena.
 - the back-office project is installed on a single server in the larp's LAN, and connects to all the stations for monitoring and command.

### Setup development enviorment

Run the following commands inside youre console window. After each install phase check with the test command that it succseded.

Install Brew: 
```bash
#install
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
#test 
brew -v
```

Install node.js. This should install node 4.x
```bash
#install
brew install homebrew/versions/node4-lts
#test 
node -v 
npm -v 
```

Install Git
```bash
#install
brew install git
#test 
git --version
```

### Setup project
```bash
git clone https://github.com/CommaSword/riddler.git
```
This will create a new folder named ```riddler``` with the latest state of the project as it appears on github.com , inside it there will be two subfolders, one for each project: ```./riddler/riddler-back-office``` and ```./riddler/riddler-station```.
Each project contains its own ```README.md``` file that offers further documentation and instructions.

## License 

GNU GPLv3
