import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './Title';
import Checkbox from '@material-ui/core/Checkbox';
import { query_results_dd } from "../data/query_results_dd";
import Rainbow from 'rainbowvis.js/rainbowvis.js';
import {top_color, bottom_color} from '../data/default_values';

// creates a row of data
function createData(id, toggle, color, subjectID, eventName, channelNum, startTime, endTime) {
    return {id, toggle, color, subjectID, eventName, channelNum, startTime, endTime};
}

// generates x number of unique hex values
function generateColors(numColors, top_color, bottom_color) {
    let colors = [];
    let color_range = new Rainbow();
    color_range.setNumberRange(1, numColors);
    color_range.setSpectrum(top_color, bottom_color);
    for (let i=1; i <= numColors; i++) {
        colors.push(color_range.colorAt(i));
    }
    return colors;

    //// use below for non-query data tables
    /*let j = 360 / (numColors - 1); // distribute the colors evenly on the hue range
    let r = []; // hold the generated colors
    for (let i=0; i<numColors; i++)
    {
        // generate distinguishable hex colors using hsv and converting to hex
        r.push(convert.hsv.hex(j * i, 100, 100)); // you can also alternate the saturation and value for even more contrast between the colors
    }
    return r;*/
}

// function to create the data table content using an external source (in this case, a constant from another file)
function createTable(data) {
    const table = [];
    let colors = generateColors(data.length, top_color, bottom_color);
    console.log(colors);
    data.map( (row, index) => {
        // todo add checkbox functionality here
        let length = table.push(createData(row.id, <Checkbox/>, colors[index], row.subjectID, row.eventName, row.channelNum, row.startTime, row.endTime));
        // console.log("length: " + length);
    });
    console.log(table);
    return table;
}

const useStyles = makeStyles(theme => ({
    // styles go here
}));

export default function DataTable() {
    const classes = useStyles();
    // setData should not be used unless we expect some sort of update while the user is looking at the data
    const [data, setData] = useState(createTable(query_results_dd));

    return (
        <React.Fragment>
            <Title>Data Table</Title>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Show</TableCell>
                        {/*<TableCell>Color</TableCell>*/}
                        <TableCell>Subject ID</TableCell>
                        <TableCell>Event Name</TableCell>
                        <TableCell>Channel Number</TableCell>
                        <TableCell>Start Time</TableCell>
                        <TableCell>End Time</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map(row => (
                        <TableRow key={row.id}>
                            <TableCell style={{backgroundColor: "#" + row.color}}>{row.toggle}</TableCell>
                            <TableCell>{row.subjectID}</TableCell>
                            <TableCell>{row.eventName}</TableCell>
                            <TableCell>{row.channelNum}</TableCell>
                            <TableCell>{row.startTime}</TableCell>
                            <TableCell>{row.endTime}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {/*<div className={classes.seeMore}>*/}
            {/*  <Link color="primary" href="#" onClick={preventDefault}>*/}
            {/*    Show more sequences*/}
            {/*  </Link>*/}
            {/*</div>*/}
        </React.Fragment>
    );
}
