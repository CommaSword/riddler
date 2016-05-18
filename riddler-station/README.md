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

### Setting up on Raspberry Pi
on a fresh installation of [raspberrian](https://www.raspbian.org/)
```bash
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
