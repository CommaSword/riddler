import React, {Component} from 'react';
import blessed from 'blessed';
import {render} from 'react-blessed';
// import Input from './input';

const stylesheet  = {
  layout: {
    width:'100%',
    height:'1',
  }
}

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
   'result',
   'abort'
];

module.exports = function(eventEmmiter) {
  class Welcome extends Component{
    constructor(props) {
      super(props);
    }

    render() {
      return(
        <box
          width={'100%'}
          height={'100%'}
          class={stylesheet.layout}>
          <text height={1} width={'100%'}>Welcome</text>
          <textbox top={2} width={50} height={20} border={{type: 'line'}}>
            <text height={1} >Hacker Platform</text>
          </textbox>
        </box>
        )
    }
  }

  class PreHack extends Component{
    constructor(props) {
      super(props);


    }
    render() {
      return(<text width={'100%'}>PreHack</text>)
    }
  }

  class Hacking extends Component{
    constructor(props) {
      super(props);


    }
    render() {
      return(<text width={'100%'}>Hacking</text>)
    }
  }

  class PostHack extends Component{
    constructor(props) {
      super(props);

    }

    render() {
      return(<text width={'100%'}>PostHack</text>)
    }
  }

  class Result extends Component{
    constructor(props) {
      super(props);


    }
    render() {
      return(<text width={'100%'}>Result</text>)
    }
  }

  const screen = blessed.screen({
    autoPadding: true,
    smartCSR: true,
    title: 'Hack and be blessed'
  });


  class App extends Component {
    constructor(props) {
      super(props);

      screen.key(['enter'], (ch, key) => {
        this.advancePage();
      });

      eventEmmiter.on('ui-message', () => {

      })

      this.state = {
        index: 0,
        page: pages[0],
      };
    }

    advancePage() {
      this.setState({
        index: this.state.index >= pages.length ? 0: ++this.state.index,
        page: pages[this.state.index >= pages.length ? 0: ++this.state.index]
      });
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