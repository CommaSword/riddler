import React, {Component} from 'react';


const stylesheet  = {
  layout: {
    width:'100%',
    height:'1'
  }
};

export class Hacking extends Component{
  static propTypes = {
    done: React.PropTypes.func.isRequired
  };
  constructor(props) {
    super(props);
    this.state = {
      first: Math.floor(Math.random() * 1000),
      second:Math.floor(Math.random() * 1000),
      touch:0
    };

  }
  componentDidMount() {
    this.refs.textbox.focus();
  }
  handleKeypress(ch, key) {
    if(key.name === 'enter'){
      let number = parseInt(this.refs.textbox.getValue());
      if(number === this.state.first * this.state.second) {
        this.props.done(this.state.first * this.state.second, number)
      } else {
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
            style={{border: {fg: 'yellow'}}}
            top={3} left={3} width={60} height={30}>
            <text top={2}>{this.state.first  + ' * '  + this.state.second} </text>
            <textbox onKeypress={::this.handleKeypress} inputOnFocus top={7} width={50} height={3} border={{type: 'line'}} ref='textbox'></textbox>
          </box>
        </form>
      </box>
      )
  }
}