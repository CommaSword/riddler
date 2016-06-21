import React, {Component} from 'react';
import blessed from 'blessed';
import {render} from 'react-blessed';
import {Welcome, PreHack, Hacking, PostHack, Result, Abort} from './components'

var IncomingMessages = {
  start_hacking:1,
  hack_denied:2,
  hack_succesful:3,
  hack_partial:4,
};

const pages = {
  'welcome' : {title:'welcome'},
  'preHack' : {title:'preHack', canDeny:true}, // shipId, detail
  'hacking' : {title:'hacking', canDeny:true},
  'postHack' : {title:'postHack', canDeny:true},
  'result' : {title:'result'}, // shipId, detail = ""
  'abort' : {title:'abort'} // shipId, detail = ""
};

module.exports = function(eventEmmiter) {

  const screen = blessed.screen({
    autoPadding: true,
    smartCSR: true,
    title: 'Hack and be blessed',
    log: 'log.txt'
  });


  function sendToBackOffice(data){
    screen.log("ui-message: ", data);
    eventEmmiter.emit("ui-message", data);
  }
  class App extends Component {
    constructor(props) {
      super(props);
      screen.key(['escape', 'q', 'C-c'], function(ch, key) {
        return process.exit(0);
      });
      screen.key(['enter'], (ch, key) => {
        screen.log("enter pressed");
        if (this.state.page === pages.welcome) {
          this.setPage(pages.preHack);
        } else if (this.state.page === pages.hacking) {
          this.setPage(pages.postHack);
        } else if (this.state.page === pages.result || this.state.page === pages.abort) {
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
            this.setPage(pages.result, "Full");
          } else if (data.state === "hackPartialSuccessful") {
            this.setPage(pages.result, "Partial");
          }
        }
      });

      this.state = {
        page: pages.welcome
      };
    }

    setPage(page, message) {
      this.setState({page});
      screen.log("state.page is now ", this.state.page)

      if (page === pages.welcome) {
        sendToBackOffice({status: 'welcome'});
      } else if (page === pages.preHack) {
        sendToBackOffice({
          status: 'preHack',
          shipId: "foo1",
          details: "bar2"
          // shipId: this.state.shipId,
          // detail: this.state.detail
        });
      } else if (page === pages.hacking) {
        sendToBackOffice({status: 'hacking'});
      } else if (page === pages.postHack) {
        sendToBackOffice({status: 'postHack'});
      } else if (page === pages.result) {
        sendToBackOffice({
          status: 'result',
          shipId: '',
          details: ''
        });
      } else if (page === pages.abort) {
        sendToBackOffice({
          status: 'result',
          shipId: '',
          details: ''
        });
      }
    }

    welcomeCallback = (ship, message) => {
      screen.log('done happend \nship: ' + ship + '\nmessage: ' + message);
    };

    render() {
      return (
          <box label="Hacker Console $"
               border={{type: 'line'}}
               style={{border: {fg: 'cyan'}}}>
            {(()=>{
              switch (this.state.page) {
                case "welcome": return <Welcome done={this.welcomeCallback}/>;
                case "preHack": return <PreHack/>;
                case 'hacking': return <Hacking/>;
                case 'postHack': return <PostHack/>;
                case 'result': return <Result/>;
                case 'abort': return <Abort/>;
              }})()}
          </box>
      );
    }
  }


  const component = render(<App />, screen);
}