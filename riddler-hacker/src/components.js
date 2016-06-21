import React, {Component} from 'react';
import recursiveReadSync from 'recursive-readdir-sync';

const stylesheet  = {
  layout: {
    width:'100%',
    height:'1'
  }
};

export class Welcome extends Component{
  static propTypes = {
    done: React.PropTypes.func.isRequired
  };
  constructor(props) {
    super(props);

  }

  componentDidMount() {
    this.refs.shipId.focus();
  }

  handleKeypressShipId(ch){
    if(ch && ch.charCodeAt(0) == 13){
      this.refs.shipId.submit();
      this.refs.objective.focus();
    }
  }
  handleKeypressOperation(ch){
    if(ch.charCodeAt(0) == 13 && this.refs.objective.content != ''){
      this.props.done(this.refs.shipId.content, this.refs.objective.content);
    }
  }

  render() {
    return(
      <box width={'100%'} height={'100%'}>
        <text height={1} width={'100%'}>Welcome</text>
        <form>
          <box
            border={{type: 'line'}}
            style={{border: {fg: 'cyan'}}}
            top={3} left={3} width={60} height={15}>
            <text top={2}>Ship ID:</text>
            <textbox onKeypress={::this.handleKeypressShipId} inputOnFocus top={3} width={50} height={3} border={{type: 'line'}} ref='shipId'></textbox>
            <text top={6}>Objective:</text>
            <textbox onKeypress={::this.handleKeypressOperation} inputOnFocus top={7} width={50} height={3} border={{type: 'line'}} ref='objective'></textbox>
          </box>
        </form>
      </box>
      )
  }
}

let files = recursiveReadSync(process.cwd());

export class PreHack extends Component{
  constructor(props) {
    super(props);
    this.state = {progress: 0, interval:null};

    this.interval = setInterval(() => {
      if (this.state.progress >= 100)
        this.setState({progress: 0});

      this.setState({progress: this.state.progress + 1});
    }, 10);
  }

  walkSync(dir) {
    let fs = require('fs');
    let filelist = [];
    files.forEach((file) => {
     if(this.state.progress > filelist.length) {
        filelist.push(file);
      }
    });
    return filelist;
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return(
      <box>
        <text width={'100%'}>PreHack</text>
        <list items={this.walkSync(process.cwd())}></list>
      </box>
      )
  }
}

export class Hacking extends Component{
  static propTypes = {
    done: React.PropTypes.func.isRequired
  }
  constructor(props) {
    super(props);
    this.state = {first: Math.floor(Math.random() * 1000), second:Math.floor(Math.random() * 1000),touch:0};

  }
  componentDidMount() {
    this.refs.textbox.focus();
  }
  handleKeypress(ch) {
    if(ch.charCodeAt(0) == 13){
      let number = parseInt(this.refs.textbox.content)
      if(number === this.state.first * this.state.second) {
        this.props.done(this.state.first * this.state.second, number)
      }
      else {
        this.refs.textbox.clearValue();
        this.setState({touch:++this.state.touch});
        this.refs.textbox.focus();
      }
    }
  }
  render() {
    return(
      <box
        width={'100%'}
        height={'100%'}
        class={stylesheet.layout}>
        <text height={1} width={'100%'}>Calculate this:</text>
        <form>
          <box
            border={{type: 'line'}}
            style={{border: {fg: 'cyan'}}}
            top={3} left={3} width={60} height={30}>
            <text top={2}>{this.state.first  + ' * '  + this.state.second} </text>
            <textbox onKeypress={::this.handleKeypress} inputOnFocus top={7} width={50} height={3} border={{type: 'line'}} ref='textbox'></textbox>
          </box>
        </form>
      </box>
      )
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