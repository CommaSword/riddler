import React, {Component} from 'react';
import blessed from 'blessed';
import {render} from 'react-blessed';
import {HackFlow} from './hack-flow'
import {Background} from './background';
import {Target} from './target';
import {Processing} from './processing';

const pages = {
  'initial' : {status:'pre-loading'},
  'welcome' : {status:'selecting target'},
  'preHack' : {status:'TARGET SELECTED', canDeny:true},
  'hacking' : {status:'hacking', canDeny:true},
  'postHack' : {status:'HACK SUCCESS', canDeny:true},
  'result' : {status:'viewing success'},
  'abort' : {status:'failed or denied'}
};
const nullStr = ' ';
module.exports = function(eventEmmiter) {

  const screen = blessed.screen({
    smartCSR: true,
    title: 'Cyber Attack Station',
    log: 'log.txt'
  });

  class App extends Component {
    constructor(props) {
      super(props);
      screen.key(['f1','C-c'], ()=> process.exit(0));
      screen.key(['escape'], ()=> this.setAbortPage());
      screen.key(['enter'], () => {
        if (this.state.page === pages.result || this.state.page === pages.abort) {
          this.setWelcomePage();
        }
      });
      eventEmmiter.on('server-message', (data) => {
        screen.log("server-message: ", data);
        if (data.state) {
          if (this.state.page.canDeny && data.state === "abort") {
            this.setPage(pages.abort);
          } else if (data.state === "ok") {
            if (this.state.page === pages.preHack) {
              this.setHackingPage();
            } else if (this.state.page === pages.postHack) {
              this.setResultPage();
            }
          }
        }
        if (data.speed){
          this.setState({speed:data.speed});
        }
        if (data.duration){
          this.setState({duration:data.duration});
        }
      });

      this.state = {
        page: pages.initial,
        shipId: nullStr,
        details: nullStr,
        speed: 40,
        duration: 100
      };
    }

    componentDidMount() {
      this.setWelcomePage();
    }

    sendToBackOffice(data){
      screen.log("ui-message: ", data);
      eventEmmiter.emit("ui-message", data);
    }

    setWelcomePage(){
      this.setPage(pages.welcome);
      this.sendToBackOffice({shipId: nullStr, details: nullStr});
    }
    setPreHackPage(shipId, details){
      this.setPage(pages.preHack);
      this.setState({shipId, details});
      this.sendToBackOffice({shipId, details});
    }
    setHackingPage(){
      this.setPage(pages.hacking);
    }
    setPostHackPage(){
      this.setPage(pages.postHack);
    }
    setResultPage(){
      this.setPage(pages.result);
    }
    setAbortPage(){
      this.sendToBackOffice({shipId: nullStr, details: nullStr});
      this.setPage(pages.abort);
    }
    setFailurePage(){
      this.setPage(pages.abort);
    }
    setPage(page) {
      this.setState({page});
      this.sendToBackOffice({status: page.status});
      screen.log("state.page is now ", page.status);
    }

    welcomeCallback(ship, message){
      this.setPreHackPage(ship, message);
      screen.log('done happend \nship: ' + ship + '\nmessage: ' + message);
    };

    hackingCallback(success){
      screen.log('Hacking done\n result: ' + success);
      if (success){
        this.setPostHackPage();
      } else {
        this.setFailurePage();
      }
    };

    render(){
      return (
          <Background >
            {(()=>{
              switch (this.state.page) {
                case pages.welcome: return <Target shipId={this.state.shipId} operation={this.state.details} done={::this.welcomeCallback}/>;
                case pages.preHack: return <Processing title={'connecting to ' + this.state.shipId}/>;
                case pages.hacking: return <HackFlow done={::this.hackingCallback} duration={this.state.duration} speed={this.state.speed}/>;
                case pages.postHack: return <Processing title="attacking target"/>;
                case pages.result: return <text left="center" top="center">operation successful</text>;
                case pages.abort: return <text left="center" top="center">no connection to target</text>;
              }})()}
          </Background>
      );
    }
  }
  render(<App />, screen);
};