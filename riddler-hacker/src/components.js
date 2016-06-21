import React, {Component} from 'react';

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
    this.refs.textbox1.focus()
  }

  handleKeypress1(ch){
    if(ch.charCodeAt(0) == 13){
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
          <textbox onKeypress={::this.handleKeypress1} inputOnFocus top={2} width={50} height={5} border={{type: 'line'}} ref='textbox1'></textbox>
          <textbox onKeypress={::this.handleKeypress2} inputOnFocus top={10} width={50} height={5} border={{type: 'line'}} ref='textbox2'></textbox>
        </form>
      </box>
      )
  }
}

var walkSync = function(dir, filelist) {
  let fs = require('fs'),
  let files = fs.readdirSync(dir);
  let filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(dir + file).isDirectory()) {
      filelist = walkSync(dir + file + '/', filelist);
    }
    else {
      filelist.push(file);
    }
  });
  return filelist;
};

export class PreHack extends Component{
  constructor(props) {
    super(props);


  }
  walkSync(dir, filelist) {
    let fs = require('fs'),
    let files = fs.readdirSync(dir);
    let filelist = filelist || [];
    files.forEach(function(file) {
      if (fs.statSync(dir + file).isDirectory()) {
        filelist = walkSync(dir + file + '/', filelist);
      }
      else {
        filelist.push(file);
      }
    });
    return filelist;
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