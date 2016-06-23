import React, {Component} from 'react';
import {screen} from './screen';
import {Hacking} from './nuvo-hack';
import {Processing} from './processing';


const messages = [
	'Cracking PGP encription',
	'Creating dummy process',
	'Overriding integrity watchdog',
	'Predicting shuffle frequency',
	'Flooding security services',
	'Injecting malicious code',
	'Activating trojan horse',
	'Analyzing attack vectors',
	'Spoofing multicast services',
	'Scanning public endpoints',
	'Synchronizing DDoS agents',
	'Jamming authentication resources',
	'Positioning signal sources',
	'Hacking second firewall'
];
function shuffle() {
	var j, x, i;
	for (i = messages.length; i; i -= 1) {
		j = Math.floor(Math.random() * i);
		x = messages[i - 1];
		messages[i - 1] = messages[j];
		messages[j] = x;
	}
}
shuffle();
let i = 0;
function getMsg(){
	if (i < messages.length){
		return messages[++i];
	} else {
		shuffle();
		return messages[i = 0];
	}
}

export class HackFlow extends Component{
	static propTypes = {
		done: React.PropTypes.func.isRequired,
		duration: React.PropTypes.number.isRequired
	};
	constructor(props) {
		super(props);
		this.state = {
			length: 4,
			timeout: false,
			hacking: true
		};
	}
	componentDidMount(){
		this.timeout = setTimeout(() => {
			if (this.state.hacking) {
				this.setState({timeout: true})
			} else {
				this.props.done(true);
			}
		}, this.props.duration * 1000);
	}

	onHackDone(success){
		if (success){
			if (this.state.timeout){
				this.props.done(true);
			} else {
				this.setState({hacking: false, length: this.state.length * 2});
				setTimeout(() => this.setState({hacking: true}), 5*1000);
			}
		} else {
			clearTimeout(this.timeout);
			this.props.done(false);
		}
	}

	render() {
		return (this.state.hacking) ?
			// TODO get charTime from back office
			<Hacking length={this.state.length} charTime={2000} done={::this.onHackDone}/> :
			<Processing title={getMsg()}/>;
	}
}
