import React, {Component} from 'react';
import blessed from 'blessed';
import {render} from 'react-blessed';
import {Welcome, PreHack, Hacking, PostHack, Result, Abort} from './components'

var IncomingMessages = {
    start_hacking:1,
    hack_denied:2,
    hack_succesful:3,
    hack_partial:4,
}

const pages = [
   'welcome',
   'preHack', // shipId, detail
   'hacking',
   'postHack',
   'result', // shipId, detail = ""
   'abort' // shipId, detail = ""
];

module.exports = function(eventEmmiter) {

  const screen = blessed.screen({
    autoPadding: true,
    smartCSR: true,
    title: 'Hack and be blessed',
    log: 'log.txt'
  });


  class App extends Component {
    constructor(props) {
      super(props);

      screen.key(['enter'], (ch, key) => {
        screen.log("enter pressed");
        if(this.state.index == 0 || this.state.index == 2){
          this.setPage(this.state.index+1);
        }
      });

      eventEmmiter.on('server-message', (data) => {
        screen.log("server-message: ", data);
        switch (data.state){
          case "hackStart": setPage(2);
          case "hackDenied": setPage(5);
          case "hackSuccessful": setPage(4, "Full");
          case "hackPartialSuccessful": setPage(4, "Partial");
        }
      })

      this.state = {
        index: 0,
        page: pages[0],
      };
    }

    advancePage(page) {
      this.setState({
        index: this.state.index >= pages.length - 1  ? 0: ++this.state.index,
        page: pages[this.state.index >= pages.length - 1 ? 0: ++this.state.index]
      });
    }

    setPage(page_index, message) {
      this.setState({
        index: page_index,
        page: pages[page_index]
      });

      var data = {}

      switch (this.state.page) {
        case 'welcome':
          data = {status: 'welcome'}
          break;
        case 'preHack':
          data = {
            status: 'preHack',
            shipId: this.state.shipId,
            detail: this.state.detail
          } // shipId, detail
          break;
        case 'hacking':
          data = {status: 'hacking'}
          break;
        case 'postHack':
          data = {status: 'postHack'}
          break;
        case 'result':
          data = {
            status: 'result',
            shipId: '',
            detail: ''
          }
          break;
        case 'abort':
          data = {
            status: 'result',
            shipId: '',
            detail: ''
          }
          break;
      }

      screen.log("ui-message: ", data);
      eventEmmiter.emit("ui-message", data)
    }

    render() {
      return (
        <box label="Hacker Console $"
          border={{type: 'line'}}
          style={{border: {fg: 'cyan'}}}>
          {(()=>{
            switch (this.state.page) {
              case "welcome": return <Welcome/>;
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

  var app = <App />;

  // screen.key(['enter'], function(ch, key) {
  //     app.advancePage();
  // });

  screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
  });

  const component = render(app, screen);
}