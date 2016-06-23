import React, {Component} from 'react';
import {screen} from './screen';
import {Hacking} from './nuvo-hack';
import {Processing} from './processing';


const verbs = [
	'Cracking',
	'Overriding',
	'Predicting',
	'Flooding',
	'Injecting',
	'Activating',
	'Analyzing',
	'Spoofing',
	'Scanning',
	'Detecting',
	'Jamming'
];
const nouns = [
	'process',
	'watchdog',
	'frequency',
	'service',
	'code',
	'trojan',
	'vector',
	'endpoint',
	'agent',
	'resource',
	'source',
	'firewall'
];
function rand(list){
	return list[Math.floor(Math.random()*list.length)];
}

export class HackFlow extends Component{
	static propTypes = {
		done: React.PropTypes.func.isRequired,
		duration: React.PropTypes.number.isRequired,
		speed: React.PropTypes.number.isRequired
	};
	constructor(props) {
		super(props);
		this.state = {
			phraseLength: 4,
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

	componentWillUnmount(){
		clearTimeout(this.timeout);
		clearTimeout(this.nextHackTimeout);
	}

	onHackDone(success){
		if (success){
			if (this.state.timeout){
				this.props.done(true);
			} else {
				this.setState({
					hacking: false,
					phraseLength: this.state.phraseLength * 2
				});
				this.nextHackTimeout = setTimeout(() => this.setState({hacking: true}), 5*1000);
			}
		} else {
			clearTimeout(this.timeout);
			this.props.done(false);
		}
	}

	render() {
		return (this.state.hacking) ?
			// TODO get charTime from back office
			<box>
				<text top={1} align="middle" width="100%" style={{fg:'yellow'}} tags={true}>
					{this.state.timeout? '{bold}{blink}ALMOST THERE{/blink}{/bold}' : ''}
				</text>
				<Hacking top={3} length={this.state.phraseLength} speed={this.props.speed} done={::this.onHackDone}/>
			</box>:
			<Processing title={`${rand(verbs)} ${rand(nouns)}`}/>;
	}
}
