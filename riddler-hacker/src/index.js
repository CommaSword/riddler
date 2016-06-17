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

const pages = {
  welcome: 'welcome', 
  preHack : 'preHack',
  hacking : 'hacking',
  postHack : 'postHack',
  result : 'result'
};

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
        <button top={3} width={50} height={20} border={{type: 'line'}}>Button</button>
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

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: pages.welcome
    };
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

const screen = blessed.screen({
  autoPadding: true,
  smartCSR: true,
  title: 'Hack and be blessed'
});

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

const component = render(<App />, screen);