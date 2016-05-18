## riddler station
Connected to various arduino hardware systems by USB, Each station instance manages several different riddles in the arena.

### configuration
The Station requires some configuration from the environment. These can be set in the environment variables of the executing process, or in a designated ```.env``` file at the root of this project. Here are the required configuration keys, along with suggested default values for development:
```properties
port=5000
```
### setup for development
in the ```riddler-station``` folder:
 - create a file named ```.env``` with above configurations
 - execute the following:
```bash
npm install 
npm start 
```
### Setting up Pi3
Download NOOBS from https://www.raspberrypi.org/downloads/   
Download formmater from https://www.sdcard.org/downloads/formatter_4/ (windows or mac)   
open formmater and use the UI to format the SD_CARD (Choose the SD card and quick format)   
drag and drop files in to the memory card   
place SDCARD in the Pi3 and plug in keyboard/mouse/screen   
Follow the UI and Install raspberrian. you may configure wifi before installing.   
when finish open terminal and perform 
```bash
# install updates
sudo apt-get update && sudo apt-get upgrade
# install node
curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
sudo apt-get install -y nodejs
# test
node -v
npm -v
# clone the code of the project in a folder of your choosing
git clone https://github.com/CommaSword/riddler.git
# on a fresh machine you will need to approve github's SSH fingerprint. It's OK if it matches this site :  https://help.github.com/articles/what-are-github-s-ssh-key-fingerprints/
# install and build station project dependencies 
cd riddler/riddler-station
npm install
```
