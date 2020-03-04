import React, {Component, Fragment} from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './Title';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import Rainbow from 'rainbowvis.js/rainbowvis.js';
import Button from '@material-ui/core/Button';
import {top_color, bottom_color} from '../data/default_values';
import TabledSeqThnl from "./TabledSeqThnl";
import SaveIcon from '@material-ui/icons/Save';
import TableContainer from "@material-ui/core/TableContainer";
import axios from "axios";
import { store } from 'react-notifications-component';

// generates x number of unique hex values between two given colors (generates a proportional gradient)
function generateColors(numColors, top_color, bottom_color) {
    let colors = [];
    let color_range = new Rainbow();
    color_range.setNumberRange(1, numColors);
    color_range.setSpectrum(top_color, bottom_color);
    for (let i=1; i <= numColors; i++) {
        colors.push(color_range.colorAt(i));
    }
    return colors;
}

export default class DataTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checkboxValues: [],
            queryResults: [],
            allChecked: false
            // filteredData: this.createTable(query_results) // initially its all data
        };
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
        this.initializeCheckboxValues = this.initializeCheckboxValues.bind(this);
        this.createTable = this.createTable.bind(this);
        this.selectAll = this.selectAll.bind(this);
        this.getTrueRows = this.getTrueRows.bind(this);
        this.createData = this.createData.bind(this);
    }

    componentDidUpdate(nextProps, nextState, snapshot) {
        // only update props if props have changed
        if (nextProps.queryResults !== this.props.queryResults) { // keep this because it prevents it from entering an infinite rerender loop
            this.setState({
                queryResults: (this.props.queryResults) ? this.createTable(this.props.queryResults) : [],
                checkboxValues: (this.props.queryResults) ? this.initializeCheckboxValues(this.props.queryResults) : []
            });
        }
    }

    // return the data rows with "show" = true
    getTrueRows(data) {
        let filteredData = [];
        data.map((row, i) => {
            if (this.state.checkboxValues[i]) {
                filteredData.push(row);
            }
        });
        return filteredData;
    }

    // updates value of corresponding checkboxValue in state when toggled to be true/false
    handleCheckboxChange(index, event) {
        let newCheckboxVal = event.currentTarget.checked; // event value
        let newCheckboxValues = [...this.state.checkboxValues]; // shallow copy of state (prevents immutability)
        newCheckboxValues[index] = newCheckboxVal; // update value of checkbox
        let all_checked = newCheckboxValues.every((value) => value === true); // returns true if all values are true
        this.setState({
            checkboxValues: newCheckboxValues,
            // only update allChecked if the value has changed
            allChecked: (all_checked !== this.state.allChecked) ? all_checked : this.state.allChecked
        }, () => {
            // console.log("updated in handle checkbox change to " + this.state.allChecked);
            // send new true data to ChartData through Dashboard
            let filteredData = this.getTrueRows(this.state.queryResults);
            if (filteredData.length !== 0) {
                this.props.sendData(filteredData);
            }
        });
    }

    selectAll(event) {
        let newAllChecked = event.currentTarget.checked;
        // create new checkbox array of all newAllChecked values
        let newCheckboxValues = Array(this.state.checkboxValues.length).fill(newAllChecked);
        // if (this.state.queryResults.length !== 0) {
        this.setState({
            checkboxValues: newCheckboxValues,
            allChecked: newAllChecked
        }, () => {
            // console.log("checkboxes updated in selectAll to " + this.state.allChecked);
            // send new true data to ChartData through Dashboard
            let filteredData = this.getTrueRows(this.state.queryResults);
            if (filteredData.length !== 0) {
                this.props.sendData(filteredData);
            }
        });
        // }

    }

    // initialize list of checkbox values to be all true, same number of items as rows in data
    initializeCheckboxValues(data) {
        let numCheckboxes = Object.keys(data).length;
        // create list of checkbox values (initialized to true)
        let checkbox_values = []; // value to be stored in showSequence (the state values are true/false)
        for (let i = 0; i < numCheckboxes; i++) {
            let length = checkbox_values.push(true);
        }
        return checkbox_values;
    }

    // creates a row of data
    createData(rank, color, id, startTime, endTime, similarity, sequence) {
        return {rank, color, id, startTime, endTime, similarity, sequence};
    }
    // function to create the data table content using an external source (in this case, a constant from another file)
    createTable(data) {
        let colors = generateColors(Object.keys(data).length, top_color, bottom_color);
        let numResults = Object.keys(data).length;
        let table = [];
        for (let i = 0; i < numResults; i++) {
            let result = data[i];
            let length = table.push(this.createData(result.ID, colors[i], result.sequence_id, result.start, result.end, result.similarity, result.data));
        }
        this.setState({
            allChecked: true
        });
        this.props.sendData(table);
        // this.props.sendData(colors);
        // console.log('table', table);
        return table;
    }

    saveButton = (e) => {
        let data_form = new FormData();
        for (let i=0; i<this.state.queryResults.length; i++) {
            data_form.append(i.toString(), JSON.stringify(this.state.queryResults[i]));
        }
        axios.post('http://localhost:5000/saveDataOutput', data_form)
            .then((response) => {
                console.log(response);
                store.addNotification({
                    title: "Download Successful",
                    message: response.data,
                    type: "success",
                    insert: "top",
                    container: "bottom-center",
                    animationIn: ["animated", "fadeIn"],
                    animationOut: ["animated", "fadeOut"],
                    dismiss: {
                        duration: 10000,
                        pauseOnHover: true,
                        onScreen: true
                    }
                })
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    render() {
        // const classes = useStyles();
        return (
            <Fragment>
                <Title>Ranked Matching Sequences</Title>
                <TableContainer>
                    <Table stickyHeader size="small" className='table-null-content'>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    Show
                                    <Checkbox checked={this.state.allChecked}
                                              style={{ width: 36, height: 36 }}
                                              icon={<CheckBoxOutlineBlankIcon style={{ fontSize: 20 }} />}
                                              checkedIcon={<CheckBoxIcon style={{ fontSize: 20 }} />}
                                              onChange={this.selectAll}/>
                                </TableCell>
                                <TableCell>Rank</TableCell>
                                <TableCell>Sequence ID</TableCell>
                                <TableCell>Start Time</TableCell>
                                <TableCell>End Time</TableCell>
                                <TableCell>Similarity</TableCell>
                                <TableCell>Thumbnail</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(this.state.queryResults) ? (this.state.queryResults.map((row, i) => (
                                <TableRow key={row.id}>
                                    <TableCell style={{backgroundColor: "#" + row.color}}>
                                        <Checkbox id={row.id}
                                                  key={i}
                                                  checked={this.state.checkboxValues[i]}
                                                  onChange={(e) => this.handleCheckboxChange(i, e)}
                                                  style={{ width: 36, height: 36 }}
                                                  icon={<CheckBoxOutlineBlankIcon style={{ fontSize: 20 }} />}
                                                  checkedIcon={<CheckBoxIcon style={{ fontSize: 20 }} />}/>
                                    </TableCell>
                                    <TableCell>{row.rank}</TableCell>
                                    <TableCell>{row.id}</TableCell>
                                    <TableCell>{row.startTime}</TableCell>
                                    <TableCell>{row.endTime}</TableCell>
                                    <TableCell>{row.similarity*100}%</TableCell>
                                    <TableCell><TabledSeqThnl color={row.color} data={row.sequence}/></TableCell>
                                </TableRow>
                            ))) : (
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <br/>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        className='save-btn'
                        disabled={this.state.queryResults.length === 0}
                        // className={classes.button}
                        startIcon={<SaveIcon/>}
                        onClick={this.saveButton}>
                        Save
                    </Button>
                </TableContainer>
                {/*<div className={classes.seeMore}>*/}
                {/*  <Link color="primary" href="#" onClick={preventDefault}>*/}
                {/*    Show more sequences*/}
                {/*  </Link>*/}
                {/*</div>*/}
            </Fragment>
        );
    }
}
