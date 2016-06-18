import React, {Component} from 'react';

const stylesheet  = {
  layout: {
    width:'100%',
    height:'1',
  }
}

export class Welcome extends Component{
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

export class PreHack extends Component{
  constructor(props) {
    super(props);


  }
  render() {
    return(<text width={'100%'}>PreHack</text>)
  }
}

export class Hacking extends Component{
  constructor(props) {
    super(props);


  }
  render() {
    return(<text width={'100%'}>Hacking</text>)
  }
}

export class PostHack extends Component{
  constructor(props) {
    super(props);

  }

  render() {
    return(<text width={'100%'}>PostHack</text>)
  }
}

export class Result extends Component{
  constructor(props) {
    super(props);


  }
  render() {
    return(<text width={'100%'}>Result</text>)
  }
}

export class Abort extends Component{
  constructor(props) {
    super(props);


  }
  render() {
    return(<text width={'100%'}>Abort</text>)
  }
}