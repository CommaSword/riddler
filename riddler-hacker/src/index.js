import React, {Component} from 'react';
import blessed from 'blessed';
import {render} from 'react-blessed';

const stylesheet  = {
  layout: {
    width:'100%',
    height:'1',
  }
}
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {level: 0};
    // here I hooked this.setState({level: <<something>> }) to input
  }
  render() {

    return (
      <box label="Hacker Console $"
         border={{type: 'line'}}
         style={{border: {fg: 'cyan'}}}>
        <ProgressBar top={4} name="Bar" level={this.state.level}/>
        <layout class={stylesheet.layout}>
          <text top="0" left="0" height="1">call sign:</text>
        </layout>
        <layout class={stylesheet.layout}>
          <text top="1" left="0" height="1">acion:</text>
        </layout>
      </box>
    );
  }
}

class ProgressBar extends Component {
  constructor(props) {
    super(props);

    this.state = {level: 0};

  }

  render() {
    //console.log(level);
    return <progressbar orientation="horizontal"
              filled={this.props.level}
              top={(this.props.top * 20) + '%'}
              left="center"
              height="15%"
              width="80%"
              label={this.props.name + ':' +this.props.level}
              border={{type: 'line'}}
              style={{border: {fg: 'red'}, bar: {bg: 'red'}}} />
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