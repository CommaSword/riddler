import React, {Component} from 'react';
import blessed from 'blessed';
import {render} from 'react-blessed';
import {Hacking} from './nuvo-hack'
import {Background} from './background';
import {Target} from './target';
import {Processing} from './processing';

const pages = {
  'welcome' : {title:'welcome'},
  'preHack' : {title:'preHack', canDeny:true}, // shipId, detail
  'hacking' : {title:'hacking', canDeny:true},
  'postHack' : {title:'postHack', canDeny:true},
  'result' : {title:'result'}, // shipId, detail = ""
  'abort' : {title:'abort'} // shipId, detail = ""
};
const results = {
  full : {title: 'total success'},
  partial : {title: 'partial success'}
};
module.exports = function(eventEmmiter) {

  const screen = blessed.screen({
   // autoPadding: true,
    smartCSR: true,
    title: 'Hack and be blessed',
    log: 'log.txt'
  });


  class App extends Component {
    constructor(props) {
      super(props);
      screen.key(['escape', 'C-c'], ()=> process.exit(0));
      screen.key(['enter'], () => {
        if (this.state.page === pages.result || this.state.page === pages.abort) {
          this.setPage(pages.welcome);
        }
      });
      eventEmmiter.on('server-message', (data) => {
        screen.log("server-message: ", data);
        if (this.state.page.canDeny && data.state === "hackDeny"){
          this.setPage(pages.abort);
        } else if (this.state.page === pages.preHack && data.state === "hackStart") {
          this.setPage(pages.hacking);
        } else if (this.state.page === pages.postHack) {
          if (data.state === "hackSuccessful") {
            this.setPage(pages.result, results.full);
          } else if (data.state === "hackPartialSuccessful") {
            this.setPage(pages.result, results.partial);
          }
        }
      });

      this.state = {
        page: pages.welcome,
        shipId: '',
        details: '',
        result: ''
      };
    }

    sendToBackOffice(data){
      screen.log("ui-message: ", data);
      // this.setState({lastMsg:data})
      eventEmmiter.emit("ui-message", data);
    }

    setPage(page, message) {
      this.setState({page});
      screen.log("state.page is now ", this.state.page);

      if (page === pages.welcome) {
        this.sendToBackOffice({status: 'welcome'});
      } else if (page === pages.preHack) {
        this.setState({
          shipId: message.shipId,
          details: message.details
        });
        this.sendToBackOffice({
          status: 'preHack',
          shipId: message.shipId,
          details: message.details
          // shipId: this.state.shipId,
          // detail: this.state.detail
        });
      } else if (page === pages.hacking) {
        this.sendToBackOffice({status: 'hacking'});
      } else if (page === pages.postHack) {
        this.sendToBackOffice({status: 'postHack'});
      } else if (page === pages.result) {
        this.setState({
          result: message.title
        });
        this.sendToBackOffice({
          status: 'result',
          shipId: '',
          details: ''
        });
      } else if (page === pages.abort) {
        this.sendToBackOffice({
          status: 'result',
          shipId: '',
          details: ''
        });
      }
    }

    welcomeCallback(ship, message){
      this.setPage(pages.preHack, {shipId: ship, details: message});
      screen.log('done happend \nship: ' + ship + '\nmessage: ' + message);
    };

    hackingCallback(success){
      screen.log('Hacking done\n result: ' + success);
      if (success){
        this.setPage(pages.postHack);
      } else {
        this.setPage(pages.abort);
      }
    };

    render(){
      return (
          <Background >
            {(()=>{
              switch (this.state.page) {
                case pages.welcome: return <Target done={::this.welcomeCallback}/>;
                case pages.preHack: return <Processing title={'connecting to ' + this.state.shipId}/>;
                case pages.hacking: return <Hacking length={20} charTime={1500} done={::this.hackingCallback}/>;
                case pages.postHack: return <Processing title="attacking target"/>;
                case pages.result: return <text left="center" top="center">{this.state.result}</text>;
                case pages.abort: return <text left="center" top="center">no connection to target</text>;
              }})()}
          </Background>
      );
    }
  }
  render(<App />, screen);
};