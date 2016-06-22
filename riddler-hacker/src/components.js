import React, {Component} from 'react';


const stylesheet  = {
  layout: {
    width:'100%',
    height:'1'
  }
};


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

  componentWillUnmount() {
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