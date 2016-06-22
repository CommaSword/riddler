import React, {Component} from 'react';
import {code} from'./../resources/code-ipsum';

export class Background extends Component{
	constructor(props) {
		super(props);
		this.state = {progress: 0};
	}

	componentDidMount(){
		this.interval = setInterval(() => {
			this.setState({progress: this.state.progress + 3});
		}, 120);
	}

	componentWillUnmount(){
		clearInterval(this.interval);
	}

	render() {
		const pos = this.state.progress % code.length;
		return(
			<box width='100%' height='100%' style={{fg: 'green'}}
				 content={code.slice(pos, pos + 100).join('\n')}>
				<box left="center" top="center" shrink={true} >
					{this.props.children}
				</box>
			</box>
		)
	}
	//<text left="center" top="center" align="right" width="155">Processing{'...'.substring(0, (pos/10) % 4)}</text>
}