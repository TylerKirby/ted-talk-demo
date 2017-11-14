import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/data';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import axios from 'axios';

function mapStateToProps(state) {
    return {
        data: state.data,
        token: state.auth.token,
        loaded: state.data.loaded,
        isFetching: state.data.isFetching,
    };
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export default class ProtectedView extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			search: ""
        }
        
        this.postSearchResult = this.postSearchResult.bind(this);
	}

	componentDidMount() {
		this.fetchData();
	}

	fetchData() {
		const token = this.props.token;
		this.props.fetchProtectedData(token);
    }
    
    postSearchResult() {
        // fetch('http://localhost:5000/api/search_results', {
        //     method: 'POST',
        //     body: JSON.stringify({
        //         search: this.state.search,
        //     })
        // }).then(({ data }) => console.log(data))
        //   .catch(error => console.log(error));
        axios.post('/api/search_results', { search: this.state.search }).then((response) => console.log(response));
    }

	render() {
		console.log(this.state)
		return (
			<div>
				{
					!this.props.loaded ? 
						<h1>Loading data...</h1>
						:
						<div>
								<div>
									<h1>Welcome back,{this.props.userName}!</h1>
									<h1>{this.props.data.data.email}</h1>
									<h2>Search over 2,000 TED Talks!</h2>
								</div>
								<div>
									<TextField
										hintText="Search..."
										onChange={(e, value) => this.setState({ search: value })}
									/>
                                    <RaisedButton 
                                        label="Search" 
                                        primary={true} 
                                        onClick={this.postSearchResult}
                                    />
								</div>
						</div>
				}
			</div>
		);
	}
}

ProtectedView.propTypes = {
    fetchProtectedData: React.PropTypes.func,
    loaded: React.PropTypes.bool,
    userName: React.PropTypes.string,
    data: React.PropTypes.any,
    token: React.PropTypes.string,
};
