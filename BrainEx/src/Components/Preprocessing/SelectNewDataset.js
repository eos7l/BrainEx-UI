import React, {Component, Fragment} from 'react';
// import {preprocessed_files, rawdata_files} from "../../data/dummy_data";
import '../../Stylesheets/Home.css';
import {Button, Link, Typography, ButtonGroup, Container} from '@material-ui/core';
import {Link as RouterLink} from "react-router-dom";
import FormData from "form-data";
import $ from "jquery";
import axios from 'axios';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import {build_options, root} from "../../data/default_values";
import ViewerForCSV from "./ViewerForCSV";
import {file_names} from '../../data/file_names'
import Paper from "@material-ui/core/Paper";


function json2array(json) {
    var result = [];
    var keys = Object.keys(json);
    keys.forEach(function (key) {
        result.push(json[key]);
    });
    return result;
}


class SelectNewDataset extends Component {

    constructor(props) {
        super(props);
        this.state = {
            current_file: null, /* for storing the currently selected file in the file-list */
            upload_files: null, /* for storing the file(s) chosen to be uploaded */
            all_files: [], /* for storing files displayed in file-list */
            curr_loi_max: null,
            data: null,
            page: 0,
            rowsPerPage: 10,
        };
        /* binding all handlers to the class */
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.onClickHandler = this.onClickHandler.bind(this);
        this.fileHandler = this.fileHandler.bind(this);
        this.isFileSelected = this.isFileSelected.bind(this);
        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
    }

    /*pull files from database here. this function is called after render() so all elements will be in place*/
    componentDidMount() {
        axios.post('http://localhost:5000/rawNames')
            .then((response) => {
                console.log(response);
                if (response.status === 200) {
                    this.setState({
                        all_files: this.state.all_files.concat(response.data.raw_files)
                    }, () => {
                        // console.log(this.state.current_file);
                        console.log(response.data.raw_files);
                    });
                } else {
                    console.log("File selection failed.");
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    // if no file is selected, do not go to next page
    isFileSelected = (e) => {
        if (this.state.current_file === null) {
            e.preventDefault();
        }
    };

    handleChangePage = (e, newPage) => {
        this.setState({
            page: newPage
        })
    };

    handleChangeRowsPerPage = e => {
        this.setState(
            {
                rowsPerPage: +e.target.value,
                page: 0
            })
    };

    /* file select handler. triggered once user clicks on a file in the file-list */
    // todo use this function to do any handling once a file in the list is selected
    fileHandler = (e) => {
        if ($(".next").attr("disabled")) {
            $(".next").removeAttr("disabled");
        }
        // get the id (index in all_files array) of the currently selected button
        let id = e.currentTarget.id;
        console.log(id);
        // grab the file with that id from the list
        let curr_file = this.state.all_files[id];
        this.setState({
            current_file: curr_file
        }, () => {
            console.log("File selected on front end.");
        });
        // console.log("current file:"); // for debugging purposes
        // console.log(curr_file);
        let file_form = new FormData();
        file_form.append("set_data", curr_file);
        axios.post('http://localhost:5000/setFileRaw', file_form)
            .then((response) => {
                if (response.status === 200) {
                    this.setState({
                        curr_loi_max: response.data.maxLength,
                        data: json2array(JSON.parse(response.data.data))
                        // todo @Kyra i need the file name returned here so i can set it as current_file in the response
                    }, () => {
                        console.log(this.state.data);
                    });
                } else {
                    console.log("File selection failed.");
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    /* triggered when files are selected from the file explorer. stores files to be uploaded to state so they can be accessed
    * when the "Add" button is clicked */
    onChangeHandler = (e) => {
        // convert FileList to an array of files
        const new_files = [...e.target.files];
        /*store files to be uploaded in state*/
        this.setState({
            upload_files: new_files
        }, () => {
            console.log("upload files added to state successfully:"); // for debugging purposes
            console.log(this.state.upload_files) // cannot print text and object in the same console.log
        }); // print state for debugging
    };

    /* when "add" is triggered this function takes the files currently in upload_states and should
    * send them to the server.*/
    onClickHandler = (e) => {
        e.preventDefault(); // prevents page refresh on submit
        /* create form data object and append files to be uploaded onto it*/
        let file_form = new FormData();
        let new_files = this.state.upload_files;
        var counter = 0;
        new_files.map((file) => {
            file_form.append("uploaded_data" + counter.toString(), file); // add upload_files to FormData object
            counter++;
        });
        // console.log(...file_form); // for debugging purposes
        let all_files = this.state.all_files;
        const file_names = new_files.map(file => file.name);
        // Hook up to Kyra's server
        axios.post('http://localhost:5000/getCSV', file_form)
            .then((response) => {
                console.log(response); // for debugging purposes
                if (response.status === 200) { // if successful
                    this.setState({
                        // todo @Kyra i need the filenames in this response
                        all_files: all_files.concat(file_names),
                        upload_files: null // reset upload_files to none
                    }, () => { // callback function for debugging
                        console.log(response.data);
                    })
                } else {
                    console.log("file upload unsuccessful. :(");
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };


    render() {

        return (
            <div className="full-height">
                <div className="row no-gutters">
                    <div className="col col-3 no-gutters">
                        <div className="left d-flex justify-content-center align-items-center">
                            <div className="home-content">
                                {/*list of files from the server (all_files, current_file)*/}
                                <Typography className="directions" variant="h4">Select a dataset to preview
                                    here</Typography>
                                <ButtonGroup className="file-list" orientation="vertical" color="primary">
                                    {this.state.all_files.map((file, index) => (
                                        <Button id={index} className="btn-file" variant="contained" key={index}
                                                onClick={this.fileHandler}>{file}</Button>
                                    ))}
                                </ButtonGroup>
                                {/*adding a new file (upload_files)*/}
                                <form className="form-group files home-content">
                                    <Typography className="directions" variant="h5">Load another dataset</Typography>
                                    <div className="new-file d-flex justify-content-center align-items-center">
                                        <input type="file" name="file" className="form-control-file" accept=".csv"
                                               onChange={this.onChangeHandler} multiple/>
                                        <Button type="submit" variant="contained" color="primary"
                                                onClick={this.onClickHandler}>Add</Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="col no-gutters">
                        <div className="right d-flex justify-content-center align-items-center">
                            <div className="home-content">
                                <div className="csv-viewer ">
                                    {(this.state.current_file === null) ? (
                                        <Typography className="directions" variant="h2" color="primary" gutterBottom>
                                            Please upload and/or choose a file on the left to proceed
                                        </Typography>
                                    ) : (
                                        (this.state.data !== null) ? (
                                            <Fragment>
                                                <Typography>File being previewed: {this.state.current_file}</Typography>
                                                <Container>
                                                    <Paper>
                                                        <TableContainer className='home-content'>
                                                            <Table stickyHeader aria-label="sticky table"
                                                                   className="csv-content" size='small'>
                                                                {/*{Object.keys(this.state.data).map((header, i) => {*/}
                                                                {/*    // loop through each header and fill in the table cell*/}
                                                                {/*<Fragment>*/}
                                                                <TableHead>
                                                                    <TableRow>
                                                                        {Object.keys(this.state.data[0]).map((col, i) => (
                                                                            <TableCell key={col + i}>
                                                                                {col}
                                                                            </TableCell>
                                                                        ))}
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {/*{console.log(json2array(this.state.data))}*/}
                                                                    {this.state.data.slice(
                                                                        this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage)
                                                                        .map((row, i) => {
                                                                            return (
                                                                                <TableRow hover tabIndex={-1}
                                                                                          key={row + i}>
                                                                                    {Object.keys(row).map((col, i) => {
                                                                                        return (
                                                                                            <TableCell>
                                                                                                {row[col]}
                                                                                                {/*{console.log(  row[col[0]], 'check fill value'*/}
                                                                                                {/*)}*/}
                                                                                            </TableCell>
                                                                                        )
                                                                                    })}
                                                                                </TableRow>
                                                                            );
                                                                        })}
                                                                </TableBody>
                                                                {/*</Fragment>*/}

                                                            </Table>
                                                        </TableContainer>
                                                        <TablePagination
                                                            rowsPerPageOptions={[10]}
                                                            component="div"
                                                            count={this.state.data.length}
                                                            rowsPerPage={this.state.rowsPerPage}
                                                            page={this.state.page}
                                                            onChangePage={this.handleChangePage}
                                                            onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                                        />
                                                    </Paper>
                                                </Container>
                                            </Fragment>
                                        ) : (
                                            <Typography variant="h2" color="primary" gutterBottom
                                                        className='csv-viewer'>
                                                No Data
                                            </Typography>
                                        )
                                    )}
                                </div>
                                <Link
                                    onClick={this.isFileSelected}
                                    disabled={true}
                                    className="build-btn next btn btn-primary"
                                    variant="button"
                                    color="default"
                                    underline="none"
                                    component={RouterLink}
                                    to={{
                                        pathname: `${build_options}`,
                                        state: {
                                            loi_max: this.state.curr_loi_max,
                                            file: this.state.current_file
                                        }
                                    }}>
                                    Proceed to Preprocessing
                                </Link>
                                <Link
                                    className="build-btn left-btn btn btn-secondary"
                                    variant="button"
                                    color="default"
                                    underline="none"
                                    component={RouterLink}
                                    to={root}>
                                    Back
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SelectNewDataset;
