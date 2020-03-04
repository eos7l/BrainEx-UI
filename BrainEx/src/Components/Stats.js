import React, {useState, useEffect, Component} from 'react';
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

    componentDidUpdate(prevProps, prevState, ss) {
        if (prevProps.statistics !== this.props.statistics) {
            this.setState({
                stats: this.props.statistics
            })
        }
    }

    // const [stats, setStats] = useState(props.statistics);

    // useEffect(() => {
    //     console.log("yo stats!");
    // }, [stats]);

    render() {
        return (
            <React.Fragment>
                <div className="stat-wrapper">
                    <Title>Statistics</Title>
                    <Divider/>
                    <List aria-label="primary">
                        {console.log(this.state.stats)}
                        {(Object.keys(this.state.stats).length !== 0) ?

                            (<React.Fragment>
                                    <ListItem>
                                        <ListItemText primary='Data Maximum' color="textPrimary"/>
                                        <Typography color="textSecondary">{this.state.stats.dataMax}</Typography>
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText primary='Data Mean' color="textPrimary"/>
                                        <Typography color="textSecondary">{this.state.stats.dataMean}</Typography>
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText primary='Data Minimum' color="textPrimary"/>
                                        <Typography color="textSecondary">{this.state.stats.dataMin}</Typography>
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText primary='Data Standard Deviation' color="textPrimary"/>
                                        <Typography color="textSecondary">{this.state.stats.dataSd}</Typography>
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText primary='Length Maximum' color="textPrimary"/>
                                        <Typography color="textSecondary">{this.state.stats.lenMax}</Typography>
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText primary='Length Minimum' color="textPrimary"/>
                                        <Typography color="textSecondary">{this.state.stats.lenMin}</Typography>
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText primary='Length Median' color="textPrimary"/>
                                        <Typography color="textSecondary">{this.state.stats.lenMedian}</Typography>
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText primary='Length Standard Deviation' color="textPrimary"/>
                                        <Typography color="textSecondary">{this.state.stats.lenSd}</Typography>
                                    </ListItem>
                                </React.Fragment>

                            )

                            : (<p>No results to display</p>)
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
                </div>
            </React.Fragment>
        );
    }
}