import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/data';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import axios from 'axios';
import Highlighter from 'react-highlight-words';

import styles from '../style.scss';

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
			search: "",
			numberOfResults: "",
			top100Results: [],
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
			axios.post('/api/search_results', { search: this.state.search })
					 .then((response) => {
						//  console.log(response);
						 this.setState({
								numberOfResults: response.data.numberOfResults,
								top100Results: response.data.results.slice(0, 101),
             });
           })
           .catch(error => console.log(error));
    }

	render() {
    const { loaded } = this.props;
    const { top100Results, numberOfResults, search } = this.state;


      return (
        <div>
            <div>
              <h1>Welcome back,{this.props.userName}!</h1>
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
            {
              top100Results.length > 0 &&
                <div>
                    <div>
                        <h2>Number of Results: {numberOfResults}</h2>
                        <h2>Top 100 Results: </h2>
                    </div>
                    <div>
                        {
                            top100Results.map(result => (
                                <div key={result.id}>
                                    <h3>URL: <a href={result.url}>{result.url}</a></h3>
                                    <Highlighter
                                        highlightClassName={styles.Active}
                                        searchWords={[search]}
                                        autoEscape={true}
                                        textToHighlight={result.transcript}
                                    />
                                </div>
                            ))
                        }
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
