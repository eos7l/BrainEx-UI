import React, {useState, useEffect, Component} from 'react';
import Divider from "@material-ui/core/Divider";
import Title from "./Title";
import clsx from 'clsx';
import { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import {
    makeStyles, Button, ButtonGroup, FormControl,
    FormGroup, FormControlLabel, Checkbox, Typography,
    Slider, Input, Grid, InputAdornment, TextField, CircularProgress
} from "@material-ui/core";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import axios from 'axios';
import {default_matches, default_overlap, excludeSameID} from "../data/default_values";

/*function preventDefault(event) {
    event.preventDefault();
}*/

const classes = {
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'column',
        alignItems: 'center',
        '& .MuiTextField-root': {
            // margin: theme.spacing(2),

        },
        // padding: theme.spacing(1),
    },
    margin: {
        // margin: theme.spacing(1),
    },
};

export default class Filter extends Component {

    constructor(props) {
        super(props);
        this.state = {
            rangeVal: [this.props.loi_min, this.props.loi_max],
            startVal: this.props.loi_min,
            endVal: this.props.loi_max,
            numMatches: default_matches,
            overlapVal: default_overlap,
            excludeID: excludeSameID,
            queryResults: null,
            isQueryIP: false,
            statistics: {},
            max_matches: this.props.max_matches
        }
    }
    // // range slider
    // const [rangeVal, setRangeVal] = useState([props.loi_min, props.loi_max]);
    // const [startVal, setStartVal] = useState(props.loi_min);
    // const [endVal, setEndVal] = useState(props.loi_max);
    // // establish constants for min and max
    // // const MIN = props.loi_min;
    // // const MAX = props.loi_max;
    // //number of matches
    // const [numMatches, setNumMatches] = useState(default_matches);
    // //overlap of sequences
    // const [overlapVal, setOverlapVal] = useState(default_overlap);
    // //exclude same id
    // const [excludeID, setExcludeID] = useState(excludeSameID);
    // // query results
    // const [queryResults, setQueryResults] = useState(null);
    //
    // const [isQueryIP, setIsQueryIP] = useState(false);
    // const [statistics, setStats] = useState({});
    // const [maxMatches, setMaxMatches] = useState(props.max_matches);

    componentDidUpdate(prevProps, prevState, snapshot) {
        // this.props.sendResults(this.state.queryResults);
        // this.props.sendStats(this.state.statistics);
        if (prevProps.max_matches !== this.props.max_matches) {
            this.setState({
                max_matches: this.props.max_matches
            })
        }
    }

    // useEffect(() => {
    //     // console.log("results received");
    //     // console.log(queryResults);
    //     props.sendResults(queryResults);
    //     props.sendStats(statistics);
    // }, [queryResults, statistics]);

    // useEffect(() => {
    //     console.log(maxMatches, "max matches in state")
    // }, [maxMatches]);

    /*useEffect(() => {
       console.log("stats received");
       console.log(statistics);
       props.sendStats(statistics);
    }, [statistics]);*/

    /*/!*update the range values for loi range*!/
    function handleRangeChange(event) {
        // console.log(event);
        const newRangeVal = event;
        setRangeVal(newRangeVal); // new value is stored in the event, not the newValue
        /!*update input values*!/
        const newStartVal = parseFloat(newRangeVal[0]);
        setStartVal(newStartVal);
        const newEndVal = parseFloat(newRangeVal[1]);
        setEndVal(newEndVal);
    }

    /!*update the input boxes for the loi range*!/
    const handleRangeChangeStart = event => {
        /!*get original range value*!/
        let newRangeVal = rangeVal;
        /!*update only the starting value*!/
        const newStartVal = parseFloat(event.target.value);
        setStartVal(newStartVal);
        // console.log("new start val: " + newStartVal);
        /!*update range value*!/
        newRangeVal[0] = newStartVal;
        setRangeVal(newRangeVal);
    };
    const handleRangeChangeEnd = event => {
        /!*get original range value*!/
        let newRangeVal = rangeVal;
        /!*update only the end value*!/
        const newEndVal = parseFloat(event.target.value);
        // console.log("new end val: " + newEndVal);
        setEndVal(newEndVal);
        /!*update range value*!/
        newRangeVal[1] = newEndVal;
        setRangeVal(newRangeVal);
    };*/

    handleMatchChange = (e) => {
        // console.log(e.target.value);
        this.setState({
            numMatches: e.target.value
        });
        // setNumMatches(e.target.value);
    };

    handleOverlapChange = (e) => {
        // console.log(e.target.value);
        this.setState({
            overlapVal: e.target.value
        });
        // setOverlapVal(e.target.value);
    };

    handleClearInput = () => {
        this.setState({
            numMatches: '',
            overlapVal: '',
            excludeSameID: null
        });
        // setNumMatches('');
        // setOverlapVal('');
        // setExcludeID(null);
    };

    handleExcludeIDChange = (e) => {
        // console.log(e.target.checked);
        this.setState({
            excludeID: e.target.checked
        });
        // setExcludeID(e.target.checked);
    };

    /*when apply is clicked, submit the form to the backend*/
    handleQuery = (e) => {
        e.preventDefault(); // dont refresh the page on submit
        // let loi = rangeVal.toString();
        let best_matches = this.state.numMatches.toString();
        let overlap = (this.state.overlapVal/100).toString();
        let excludeS = this.state.excludeID.toString();
        let form = new FormData();
        // form.append("loi", loi);
        form.append("best_matches", best_matches);
        form.append("overlap", overlap);
        form.append("excludeS", excludeS);
        // console.log(form);
        this.props.sendProgress(true); // querying is now in progress
        axios.post('http://localhost:5000/query', form)
            .then((response) => {
                console.log(response);
                console.log(response.data.message);
                // let queryResponse = response.data;
                let queryResults = JSON.parse(response.data['resultJSON']);
                let stats = {
                    dataMax: response.data.dataMax,
                    dataMean: response.data.dataMean,
                    dataMedian: response.data.dataMedian,
                    dataMin: response.data.dataMin,
                    dataSd: response.data.dataSd,
                    lenMax: response.data.lenMax,
                    lenMean: response.data.lenMean,
                    lenMedian: response.data.lenMedian,
                    lenMin: response.data.lenMin,
                    lenSd: response.data.lenSd
                };
                this.setState({
                    queryResults: queryResults,
                    statistics: stats
                }, () => {
                    this.props.sendProgress(false); // query results have been returned
                    this.props.sendResults(this.state.queryResults);
                    this.props.sendStats(this.state.statistics);
                });
                // setQueryResults(JSON.parse(response.data['resultJSON']));
                // setStats(stats);
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    render() {
        return (
            <React.Fragment>
                <React.Fragment>
                    {/*{(isQueryIP) ? (<CircularProgress className="query_progress" color="primary"/>) : ""} /!*todo finish implementing this, make absolute overlay on page*!/*/}
                    <Title>Query Options</Title>
                    <Divider/>
                    <form className={classes.root} noValidate autoComplete="off">
                        <FormControl component="fieldset">
                            <FormGroup>
                                {/*
                            <Grid container spacing={2} alignItems="center">
                                <Grid item>
                                    <Input
                                        className={classes.input}
                                        value={startVal}
                                        margin="dense"
                                        onChange={handleRangeChangeStart}
                                        // onBlur={handleBlur}
                                        inputProps={{
                                            step: 0.1,
                                            min: MIN,
                                            max: MAX,
                                            type: 'number',
                                            'aria-labelledby': 'input-slider',
                                        }}/>
                                </Grid>
                                <Grid item xs>
                                    <Range
                                        value={rangeVal}
                                        step={0.1}
                                        min={MIN}
                                        max={MAX}
                                        onChange={handleRangeChange}/>
                                </Grid>
                                <Grid item>
                                    <Input
                                        className={classes.input}
                                        value={endVal}
                                        margin="dense"
                                        onChange={handleRangeChangeEnd}
                                        // onBlur={handleBlur}
                                        valueLabelDisplay="auto"
                                        inputProps={{
                                            step: 0.1,
                                            min: MIN,
                                            max: MAX,
                                            type: 'number',
                                            'aria-labelledby': 'input-slider',
                                        }}/>
                                </Grid>
                            </Grid>*/}

                                {/* NUMBER OF MATCHES FIELD */}
                                <TextField
                                    required
                                    value={this.state.numMatches}
                                    onChange={this.handleMatchChange}
                                    id="outlined-number"
                                    label="Number of best sequence matches"
                                    placeholder={default_matches}
                                    // multiline
                                    size="small"
                                    variant="filled"
                                    inputProps={{
                                        step: 1,
                                        min: 1,
                                        max: this.state.max_matches,
                                        type: 'number'
                                    }}/>
                                {/* OVERLAP FIELD */}
                                <TextField
                                    required
                                    value={this.state.overlapVal}
                                    onChange={this.handleOverlapChange}
                                    variant="filled"
                                    label="Overlap of sequences allowed"
                                    id="overlap-percentage"
                                    size="small"
                                    placeholder={default_overlap}
                                    className={clsx(classes.margin, classes.textField)}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">%</InputAdornment>,
                                    }}
                                    inputProps={{
                                        min: 0,
                                        max: 100,
                                        type: 'number'
                                    }}/>
                                {/* EXCLUDE SAME ID FIELD */}
                                <FormControlLabel
                                    value="checkBox"
                                    control={<Checkbox color="primary"
                                                       checked={this.state.excludeID}
                                                       onChange={this.handleExcludeIDChange}
                                                       style={{ width: 36, height: 36 }}
                                                       icon={<CheckBoxOutlineBlankIcon style={{ fontSize: 20 }} />}
                                                       checkedIcon={<CheckBoxIcon style={{ fontSize: 20 }} />}/>}
                                    label="Exclude subsequence matches from current query sequence"
                                    labelPlacement="end"
                                />
                            </FormGroup>
                        </FormControl>
                        <div className={classes.root}>
                            <ButtonGroup>
                                <Button type="submit" size="medium" variant="contained" color="primary"
                                        onClick={this.handleQuery}>
                                    Submit Query
                                </Button>
                                <Button size="medium" variant="contained" color="default" onClick={this.handleClearInput}>
                                    Clear Results {/*todo dialog letting user know that this will erase the table and graph*/}
                                </Button>
                            </ButtonGroup>
                        </div>
                    </form>
                </React.Fragment>
            </React.Fragment>
        );
    }
}
