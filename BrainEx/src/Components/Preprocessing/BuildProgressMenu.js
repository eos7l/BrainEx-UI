import React, {Component} from "react";
import {Link as RouterLink} from "react-router-dom";
import "../../Stylesheets/BuildProgressMenu.css";
import {
    Link, ButtonGroup, Typography, LinearProgress,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
} from '@material-ui/core';
import $ from "jquery";
import {query_page, data_exp, build_options, root} from "../../data/default_values";
import Button from "@material-ui/core/Button";
import {homepage} from "d3/dist/package";
import axios from "axios";
import { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import CircularProgress from "@material-ui/core/CircularProgress";

class BuildProgressMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            form_data: this.props.location.state.form_data,
            loi_min: this.props.location.state.loi_min,
            loi_max: this.props.location.state.loi_max,
            open: false,
            message: null,
            mode: null,
            isPreprocessing: true,
            preprocessed_dataset: null,
            isDownloading: false,
            num_sequences: 0,
            old_max: this.props.location.state.old_max
        };
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.cancelPreprocessing = this.cancelPreprocessing.bind(this);
        this.saveDataset = this.saveDataset.bind(this);
    }

    componentDidMount() {
        axios.post('http://localhost:5000/build', this.state.form_data)
            .then((response) => {
                console.log(response);
                this.setState({
                    isPreprocessing: false,
                    num_sequences: response.data.num_sequences
                    // preprocessed_dataset: response.data.data
                }, () => {
                    console.log(response.data.message);
                    console.log(this.state.num_sequences, "num_seq in state");
                })
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    // open model by setting all modal state values and displaying appropriate message
    openModal = (mode) => {
        let message = "";
        if (mode === "cancel") {
            message = "Cancel preprocessing and return to previous page?";
        } else if (mode === "home") {
            message = "Cancel preprocessing and return to the home page?"
        } else {
            console.log("Invalid modal mode.");
        }
        return () => {
            this.setState({
                open: true,
                message: message,
                mode: mode
            });
        }
    };

    // reset all modal state values to close modal
    closeModal = () => {
        this.setState({
            open: false,
            message: null,
            mode: null
        });
    };

    // cancel preprocessing, close modal and go to next page
    // todo @Kyra cancel preprocessing here
    cancelPreprocessing = () => {
        let mode = this.state.mode;
        this.closeModal();
        // console.log("preprocessing \"cancelled\".");
        if (mode === "cancel") {
            // return to previous screen
            axios.post('http://localhost:5000/restart')
                .then((response) => {
                    console.log(response);
                    if (response.status === 200) {
                        store.addNotification({
                            title: "Spark session ended",
                            message: response.data,
                            type: "info",
                            insert: "top",
                            container: "bottom-left",
                            animationIn: ["animated", "fadeIn"],
                            animationOut: ["animated", "fadeOut"],
                            dismiss: {
                                duration: 5000,
                                pauseOnHover: true,
                                onScreen: true
                            }
                        });
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
            this.props.history.push(build_options, {loi_max: this.state.old_max});
        } else if (mode === "home") {
            // return to home
            axios.post('http://localhost:5000/restart')
                .then((response) => {
                    console.log(response);
                    if (response.status === 200) {
                        store.addNotification({
                            title: "Spark session ended",
                            message: response.data,
                            type: "info",
                            insert: "top",
                            container: "bottom-left",
                            animationIn: ["animated", "fadeIn"],
                            animationOut: ["animated", "fadeOut"],
                            dismiss: {
                                duration: 5000,
                                pauseOnHover: true,
                                onScreen: true
                            }
                        });
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
            this.props.history.push(root);
        } else {
            console.log("invalid modal mode.")
        }
    };

    saveDataset = (e) => {
        if (!this.state.isDownloading) { // if there is currently no download in progress
            this.setState({
                isDownloading: true
            }, () => {
                console.log("isDownloading set to true");
                axios.post('http://localhost:5000/saveFilePro')
                    .then((response) => {
                        console.log(response);
                        this.setState({
                            isDownloading: false
                        } ,() => {
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
                            });
                        });
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            });
        } else {
            store.addNotification({
                title: "Application Error",
                message: "Download in progress. Please wait.",
                type: "danger",
                insert: "top",
                container: "bottom-center",
                animationIn: ["animated", "fadeIn"],
                animationOut: ["animated", "fadeOut"],
                dismiss: {
                    duration: 5000,
                    pauseOnHover: true,
                    onScreen: true
                }
            })
        }
    };

    goToHome = (e) => {
        axios.post('http://localhost:5000/restart')
            .then((response) => {
                console.log(response);
                if (response.status === 200) {
                    store.addNotification({
                        title: "Spark session ended",
                        message: response.data,
                        type: "info",
                        insert: "top",
                        container: "bottom-left",
                        animationIn: ["animated", "fadeIn"],
                        animationOut: ["animated", "fadeOut"],
                        dismiss: {
                            duration: 5000,
                            pauseOnHover: true,
                            onScreen: true
                        }
                    });
                    this.props.history.push(root);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    render() {
        return (
            <div className="full-height">
                {/* DIALOG MODAL FOR CANCELLING PREPROCESSING */}
                <Dialog className="dialog" open={this.state.open} onClose={this.closeModal}>
                    <DialogTitle className="prog-item" id="alert-dialog-title">{this.state.message}</DialogTitle>
                    <DialogContent>
                        <Typography className="prog-item" id="alert-dialog-description">
                            Clicking "yes" will cancel the preprocessing that is currently running and
                            send you to the page indicated above.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.closeModal} color="primary">
                            No
                        </Button>
                        <Button onClick={this.cancelPreprocessing} color="primary">
                            Yes
                        </Button>
                    </DialogActions>
                </Dialog>
                {(this.state.isPreprocessing) ? (
                    /*display when build is in progress*/
                    <div className="prog-content in-progress">
                        <LinearProgress className="progress"/>
                        <Typography className="prog-item" variant="h4">Preprocessing is currently in
                            progress</Typography>
                        <ButtonGroup className="prog-item">
                            <Link className="btn btn-secondary" variant="button" underline="none"
                                  component={RouterLink} onClick={this.openModal("home")}>
                                Cancel and return to home
                            </Link>
                            <Link className="btn btn-secondary" variant="button" underline="none"
                                  component={RouterLink} onClick={this.openModal("cancel")}>
                                Cancel preprocessing
                            </Link>
                        </ButtonGroup>
                    </div>
                ) : (
                    /*display below is for when build is finished*/
                    <div className="prog-content finished">
                        <LinearProgress variant="determinate" value={100} className="progress"/>
                        <Typography className="prog-item" variant="h4">Preprocessing stage is complete!</Typography>
                        {/*todo by Sequences does she mean lines of data?*/}
                        {/*<Typography className="prog-item" variant="h4">Sequences Processed: N/A</Typography>*/}
                        <ButtonGroup className="prog-item">
                            <Link
                                className="btn btn-secondary"
                                variant="button"
                                // color="defaultcolor="secondary"
                                underline="none"
                                component={RouterLink}
                                // to={root}
                                onClick={this.goToHome}>
                                Restart with another dataset
                            </Link>
                            {/*<Link*/}
                            {/*    className="btn btn-primary"*/}
                            {/*    variant="button"*/}
                            {/*    color="default"*/}
                            {/*    underline="none"*/}
                            {/*    component={RouterLink}*/}
                            {/*    to={data_exp}>*/}
                            {/*    Explore loaded data*/}
                            {/*</Link>*/}
                            <Link
                                className="btn btn-primary"
                                variant="button"
                                color="default"
                                underline="none"
                                component={RouterLink}
                                to={{
                                    pathname: `${query_page}`,
                                    state: {
                                        loi_max: this.state.loi_max,
                                        loi_min: this.state.loi_min,
                                        max_matches: this.state.num_sequences
                                    }
                                }}>
                                Find Similar Sequences
                            </Link>
                        </ButtonGroup>
                        <div className="save_preprocessed">
                            <Button className="save_data" color="primary" variant="outlined" onClick={this.saveDataset}>Download
                                preprocessed dataset</Button>
                            {(this.state.isDownloading) ? (
                                <div>
                                    <br/>
                                    <br/>
                                    <CircularProgress className="save_progress" color="primary"/>
                                </div>) : ("")}
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default BuildProgressMenu;
