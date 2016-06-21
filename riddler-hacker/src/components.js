import React, {Component} from 'react';
import recursiveReadSync from 'recursive-readdir-sync';
import {code} from'./code-ipsum';


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

export class PreHack extends Component{
  constructor(props) {
    super(props);
    this.state = {progress: 0};
  }

  componentDidMount(){
    this.interval = setInterval(() => {
      this.setState({progress: this.state.progress + 3});
    }, 150);
  }

  componentWillUnmount(){
    clearInterval(this.interval);
  }

  render() {
    const pos = this.state.progress % code.length;
    return(
        <box>
          <box content={code.slice(pos, pos + 100).join('\n')} style={{fg: 'green'}}>
            <text left="center" top="center" align="right" width="155">Processing{'...'.substring(0, (pos/10) % 4)}</text>
          </box>
        </box>
    )
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