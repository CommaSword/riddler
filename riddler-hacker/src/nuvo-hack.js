/**
 * Created by amira on 22/6/16.
 */
import React, {Component} from 'react';
import {screen} from './screen';


function randomString(length){
	var result = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for( var i=0; i < length; i++ ) {
		result += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return result;
}
const interval = 200;
const superHumanTypeTime = 20;
export class Hacking extends Component{
	static propTypes = {
		done: React.PropTypes.func.isRequired,
		length: React.PropTypes.number.isRequired,
		speed: React.PropTypes.number.isRequired
	};
	constructor(props) {
		super(props);
		this.state = {
			stringToHack: randomString(this.props.length),
			userInput: '',
			timeLeft: this.time()
		};
	}
	time(){
		return Math.floor(60 * 1000 * this.props.length / this.props.speed);
	}
	componentDidMount(){
		this.refs.textbox.focus();
		this.refs.textbox.on('keypress', this.handleKeypress);
		this.interval = setInterval(() => {
			this.setState({timeLeft: this.state.timeLeft - interval});
			if (this.state.timeLeft <= 0){
				// timeout: player lost
				return this.props.done(false);
			}
		}, interval);
	}
	componentWillUnmount(){
		this.refs.textbox.off('keypress', this.handleKeypress);
		clearInterval(this.interval);
	}
	handleKeypress = (ch) => {
		// assert no dirty tricks (copy-paste etc.)
		const now = Date.now();
		if (now - this.lastKeyTime < superHumanTypeTime){
			return this.props.done(false);
		}
		this.lastKeyTime = now;
		// apply new char and check if correct
		let userInput = this.state.userInput + ch;
		if(this.state.stringToHack.indexOf(userInput) !== 0){
			userInput = userInput.slice(0, -1);
		}
		// see if player won the game
		if(userInput.indexOf(this.state.stringToHack) === 0){
			return this.props.done(true);
		}
		// update state
		this.setState({userInput: userInput});
	};
	render() {
		return(
			<box left='center' top='center'>
				<progressbar orientation="horizontal"
							 pch = ";"
							 filled={100 * (this.time() - this.state.timeLeft )/this.time()}
							 height={1}
							 width={this.state.stringToHack.length}
							 style={{ bar: {bg: 'yellow', fg:'black'}}} />

				<text top={1}>{this.state.stringToHack}</text>
				<text top={2} width={50} height={1} ref='textbox' style={{fg:'green'}}>{this.state.userInput}</text>
			</box>
		)
	}
}
