import React , {Component} from "react";
import {withRouter} from 'react-router-dom';
import Dashboard from "./Dashboard";

class QueryFinder extends Component {

    render() {
        console.log("we are in QueryFinder");
        return(
            <div >
                <Dashboard max_matches={this.props.location.state.max_matches} loi_min={this.props.location.state.loi_min} loi_max={this.props.location.state.loi_max}/>
            </div>
        );
    }
}

export default withRouter(QueryFinder);