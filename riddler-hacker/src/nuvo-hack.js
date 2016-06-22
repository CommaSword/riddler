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
		done: React.PropTypes.func.isRequired,
		length: React.PropTypes.number.isRequired,
		time: React.PropTypes.number.isRequired
	};
	constructor(props) {
		super(props);
		this.state = {
			stringToHack: randomString(this.props.length),
			timeLeft: this.props.time
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
		this.refs.bar.progress()
		 // this.refs.textbox.focus();
	}
	render() {
		return(
			<box>
				<progressbar orientation="horizontal"
							 filled={100 * (this.props.time - this.state.timeLeft )/this.props.time}
							 height={1}
							 width={this.state.stringToHack.length}
							 style={{ bar: {bg: 'blue'}}} />

				<text top={1}>{this.state.stringToHack}</text>
				<textbox onKeyPress={::this.handleKeypress} inputOnFocus top={2} width={50} height={3} ref='textbox'></textbox>
			</box>
		)
	}
}
