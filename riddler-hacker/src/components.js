import React, {Component} from 'react';
import recursiveReadSync from 'recursive-readdir-sync';

const stylesheet  = {
  layout: {
    width:'100%',
    height:'1',
  }
}

export class Welcome extends Component{
  static propTypes = {
      done: React.PropTypes.func.isRequired
  }
  constructor(props) {
    super(props);

  }

  componentDidMount() {
    this.refs.textbox1.focus();
  }

  handleKeypress1(ch){
    if(ch && ch.charCodeAt(0) == 13){
      this.refs.textbox1.submit()
      this.refs.textbox2.focus()
    }
  }
  handleKeypress2(ch){
    if(ch.charCodeAt(0) == 13 && this.refs.textbox2.content != ''){
      this.props.done(this.refs.textbox1.content, this.refs.textbox2.content);
    }
  }

  render() {
    return(
      <box
        width={'100%'}
        height={'100%'}
        class={stylesheet.layout}>
        <text height={1} width={'100%'}>Welcome</text>
        <form>
          <box
            border={{type: 'line'}}
            style={{border: {fg: 'cyan'}}}
            top={3} left={3} width={60} height={30}>
            <text top={2}>Ship ID:</text>
            <textbox onKeypress={::this.handleKeypress1} inputOnFocus top={3} width={50} height={3} border={{type: 'line'}} ref='textbox1'></textbox>
            <text top={6}>Hacking Attempt Request:</text>
            <textbox onKeypress={::this.handleKeypress2} inputOnFocus top={7} width={50} height={3} border={{type: 'line'}} ref='textbox2'></textbox>
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
    this.state = {progress: 0};

    const interval = setInterval(() => {
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
    //todo: before game change to 1000
    this.state = {first: Math.floor(Math.random() * 10), second:Math.floor(Math.random() * 10)};

  }
  componentDidMount() {
    this.refs.textbox.focus();
  }
  handleKeypress(ch) {
    if(ch.charCodeAt(0) == 13){
      let number = parseInt(this.refs.textbox.content)
      number === this.state.frist * this.state.second && this.props.done();
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