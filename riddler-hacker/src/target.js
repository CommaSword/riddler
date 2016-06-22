/**
 * Created by amira on 22/6/16.
 */


import React, {Component} from 'react';

export class Target extends Component{
	static propTypes = {
		done: React.PropTypes.func.isRequired
	};
	constructor(props) {
		super(props);

	}

	componentDidMount() {
		this.refs.shipId.focus();
	}

	handleKeypressShipId(ch, key) {
		if(key.name === 'enter'){
			this.refs.shipId.submit();
			this.refs.objective.focus();
		}
	}
	handleKeypressOperation(ch, key) {
		if(key.name === 'enter' && this.refs.objective.getValue() != ''){
			this.props.done(this.refs.shipId.getValue(), this.refs.objective.getValue());
		}
	}

	render() {
		return(
			<box
				border={{type: 'line'}}
				style={{border: {fg: 'cyan'}}}
				top={3} left={3} width={60} height={15}>
				<form>
					<text top={2}>ship sign</text>
					<textbox onKeypress={::this.handleKeypressShipId} inputOnFocus top={3} width={50} height={3} border={{type: 'line'}} ref='shipId'></textbox>
					<text top={6}>objective</text>
					<textbox onKeypress={::this.handleKeypressOperation} inputOnFocus top={7} width={50} height={3} border={{type: 'line'}} ref='objective'></textbox>
				</form>
			</box>

		)
	}
}