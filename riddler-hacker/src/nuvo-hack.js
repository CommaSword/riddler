/**
 * Created by amira on 22/6/16.
 */
import React, {Component} from 'react';


function randomString(length){
	var result = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for( var i=0; i < length; i++ ) {
		result += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return result;
}

export class Hacking extends Component{
	static propTypes = {
		done: React.PropTypes.func.isRequired
	};
	totalTime = 10 * 1000;
	constructor(props) {
		super(props);
		this.state = {
			stringToHack: '12345',
			timeLeft: this.totalTime
		};
	}
	componentDidMount(){
		this.refs.textbox.focus();
		const interval = 120;
		this.interval = setInterval(() => {
			this.setState({timeLeft: this.state.timeLeft - interval});
			if (this.state.timeLeft <= 0){
				return this.props.done(false);
			}
		}, interval);
	}
	componentWillUnmount(){
		clearInterval(this.interval);
	}
	handleKeypress(ch, key) {
		let userText = this.refs.textbox.getValue();
		while(this.state.stringToHack.indexOf(userText) !== 0){
			userText = userText.substring(0, -1);
		}
		if(userText.indexOf(this.state.stringToHack) === 0){
			return this.props.done(true);
		}
		this.refs.textbox.setValue(userText);
		 // this.refs.textbox.focus();
	}
	render() {
		return(
			<box
				border={{type: 'line'}}
				style={{border: {fg: 'yellow'}}}
				top={3} left={3} width={60} height={30}>
				<progressbar top={2} value={100*this.state.timeLeft/this.totalTime}>{this.state.stringToHack} </progressbar>
				<textbox onPrerender={::this.handleKeypress} inputOnFocus top={7} width={50} height={3} ref='textbox'></textbox>
			</box>
		)
	}
}
