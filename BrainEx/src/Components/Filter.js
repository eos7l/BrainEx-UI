import React, {useState} from 'react';
import Divider from "@material-ui/core/Divider";
import Title from "./Title";
import clsx from 'clsx';
import { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import { makeStyles, Button, ButtonGroup, FormControl,
    FormGroup, FormControlLabel, Checkbox, Typography,
    Input, Grid, InputAdornment, TextField } from "@material-ui/core";

/*function preventDefault(event) {
    event.preventDefault();
}*/

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'column',
        alignItems: 'center',
        '& .MuiTextField-root': {
            margin: theme.spacing(2),

        },
        padding: theme.spacing(1),
    },
    margin: {
        margin: theme.spacing(1),
    },
}));


/*function valuetext(value) {
    return `${value}milisecond`;
}*/

export default function Filter() {
    const classes = useStyles();
    //range slider
    const [rangeVal, setRangeVal] = useState([0.00, 100.00]);
    const [startVal, setStartVal] = useState(0.00);
    const [endVal, setEndVal] = useState(100.00);
    const [numMatches, setNumMatches] = useState(5);

    /*update the range values for loi range*/
    function handleRangeChange(event) {
        // console.log(event);
        const newRangeVal = event;
        setRangeVal(newRangeVal); // new value is stored in the event, not the newValue
        /*update input values*/
        const newStartVal = parseFloat(newRangeVal[0]);
        setStartVal(newStartVal);
        const newEndVal = parseFloat(newRangeVal[1]);
        setEndVal(newEndVal);
    }

    /*update the input boxes for the loi range*/
    const handleRangeChangeStart = event => {
        /*get original range value*/
        let newRangeVal = rangeVal;
        /*update only the starting value*/
        const newStartVal = parseFloat(event.target.value);
        setStartVal(newStartVal);
        // console.log("new start val: " + newStartVal);
        /*update range value*/
        newRangeVal[0] = newStartVal;
        setRangeVal(newRangeVal);
    };
    const handleRangeChangeEnd = event => {
        /*get original range value*/
        let newRangeVal = rangeVal;
        /*update only the end value*/
        const newEndVal = parseFloat(event.target.value);
        // console.log("new end val: " + newEndVal);
        setEndVal(newEndVal);
        /*update range value*/
        newRangeVal[1] = newEndVal;
        setRangeVal(newRangeVal);
    };

    const handleMatchChange = (e) => {
        console.log(e.target.value);
        setNumMatches(e.target.value);
    };

    /*when apply is clicked, submit the form to the backend*/
    const handleQuery = (e) => {
        e.preventDefault(); // dont refresh the page on submit
        console.log(e.currentTarget);
    };

    /*const handleBlur = () => {
        if (rangeVal[0] < 0) {
            setRangeVal(0);
        } else if (rangeVal[1] > 100) {
            setRangeVal(100);
        }
    };*/

    return (
        <React.Fragment>
            <React.Fragment>
                <Title>Filter</Title>
                <Divider/>
                <form className={classes.root} noValidate autoComplete="off">
                    <FormControl component="fieldset">
                        <FormGroup>
                            <Typography id="range-slider" gutterBottom>
                                Lengths of interest for matches
                            </Typography>
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
                                            min: 0,
                                            max: 100,
                                            type: 'number',
                                            'aria-labelledby': 'input-slider',
                                        }}
                                    />
                                </Grid>
                                <Grid item xs>
                                    <Range
                                        value={rangeVal}
                                        step={0.1}
                                        min={0} /*todo set as min loi from build options*/
                                        max={100} /*todo set as max loi from build options*/
                                        onChange={handleRangeChange}
                                    />
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
                                            min: 0,/*todo set as min loi from build options*/
                                            max: 100,/*todo set as max loi from build options*/
                                            type: 'number',
                                            'aria-labelledby': 'input-slider',
                                        }}
                                    />
                                </Grid>
                            </Grid>

                            <TextField
                                required
                                value={numMatches}
                                onChange={handleMatchChange}
                                id="outlined-number"
                                label="Number of best sequence matches"
                                placeholder="5"
                                // multiline
                                size="small"
                                variant="filled"
                                inputProps={{
                                            step: 1,
                                            min: 1,/*todo set as min loi from build options*/
                                            type: 'number'
                                        }}
                            />
                            <TextField
                                required
                                variant="filled"
                                label="Overlap of sequence allowed"
                                id="overlap-percentage"
                                size="small"
                                placeholder="40"
                                className={clsx(classes.margin, classes.textField)}
                                InputProps={{
                                    endAdornment: <InputAdornment position="start">%</InputAdornment>,
                                }}
                            />

                            <FormControlLabel
                                value="checkBox"
                                control={<Checkbox color="primary"/>}
                                label="Exclude subsequence matches from current sequence"
                                labelPlacement="end"
                            />


                        </FormGroup>
                        <div className={classes.root}>
                            <ButtonGroup>
                                <Button type="submit" size="medium" variant="contained" color="primary" onClick={handleQuery}>
                                    Apply
                                </Button>
                                <Button size="medium" variant="contained" color="default">
                                    Clear
                                </Button>
                            </ButtonGroup>
                        </div>
                    </FormControl>
                </form>

            </React.Fragment>
        </React.Fragment>
    );
}