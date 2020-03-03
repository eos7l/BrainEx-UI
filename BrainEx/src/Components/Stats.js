import React, {useState, useEffect, Component } from 'react';
import Divider from "@material-ui/core/Divider";
import {makeStyles} from "@material-ui/core/styles";
import Title from "./Title";
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import ListItemText from '@material-ui/core/ListItemText';

const useStyles = makeStyles({
    depositContext: {
        flex: 1,
    },
});


/*function preventDefault(event) {
    event.preventDefault();
}*/

export default class Stats extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stats: this.props.statistics
        }
    }

    componentDidUpdate(nextProps, nextState, ss) {
        if (nextProps.statistics !== this.props.statistics) {
            this.setState({
                stats: this.props.statistics
            })
        }
    }

    // const [stats, setStats] = useState(props.statistics);

    // useEffect(() => {
    //     console.log("yo stats!");
    // }, [stats]);

    // const classes = useStyles();
    render() {
        return (
            <React.Fragment>
                <Title>Statistics</Title>
                <Divider/>
                <List aria-label="primary">
                    {console.log(this.state.stats)}
                    {(Object.keys(this.state.stats).length !== 0) ? (
                        Object.keys(this.state.stats).map(statKey => {
                            return (
                                <ListItem>
                                    <ListItemText primary={statKey} color="textPrimary"/>
                                    <Typography color="textSecondary">{this.state.stats[statKey]}</Typography>
                                </ListItem>
                            );
                        })) : (<p>No results to display</p>)
                    }
                    {/*<ListItem>
                    <ListItemText primary="Mean" color="textPrimary"/>
                    <Typography color="textSecondary">3.52</Typography>
                </ListItem>
                <ListItem>
                    <ListItemText primary="Mode"/>
                    <Typography color="textSecondary">4.67</Typography>
                </ListItem>*/}
                </List>
            </React.Fragment>
        );
    }
}