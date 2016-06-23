/**
 * Created by amira on 22/6/16.
 */
import React, {Component} from 'react';

export class Processing extends Component{
	static propTypes = {
		title: React.PropTypes.string.isRequired
	};
	constructor(props) {
		super(props);
		this.state = {progress: Math.floor(Math.random()*10)};
	}

	componentDidMount(){
		this.interval = setInterval(() => {
			this.setState({progress: this.state.progress + 1});
		}, 600);
	}

	componentWillUnmount(){
		clearInterval(this.interval);
	}

	render() {
		return(
			<text left="center" top="center" align="right" width="50%">{this.props.title + '...'.substring(0, this.state.progress % 4)}</text>
		)
	}
}