import React, {Component, useState, useEffect} from 'react';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import DataTable from './DataTable';
import CurrSeqSelection from './CurrSeqSelection.js'
import Filter from './Filter.js'
import ChartData from './ChartData.js'
import Chart from './Chart.js'
import Stats from './Stats.js'
import LoadingOverlay from 'react-loading-overlay';

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="http://interaction.mystrikingly.com/#people/">
                Worcester Polytechnic Institute Interaction Lab
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
    },
    title: {
        flexGrow: 1,
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    fixedHeightChart: {
        height: 530,
    },
    fixedHeightTable: {
        height: 750,
    }
}));

export default function Dashboard(props) {
    const classes = useStyles();
    const fixedHeightChartPaper = clsx(classes.paper, classes.fixedHeightChart);
    const fixedHeightTablePaper = clsx(classes.paper, classes.fixedHeightTable);
    const [receivedData, setDataState] = useState(() => []);
    const [queryResults, setResults] = useState(() => {
    });
    const [isQuerying, setQuerying] = useState(false);
    const [statistics, setStats] = useState({});
    const [max_matches, set_max] = useState(props.max_matches);
    // const [queryBtn, setQueryBtn] = useState(true);

    useEffect(() => {
        console.log(max_matches, "dashboard received matches!");
    }, [max_matches]);

    useEffect(() => {
        // console.log("parent received data!");
        // console.log(receivedData);
    }, [receivedData]);

    useEffect(() => {
        // console.log("parent received results!");
        // console.log(queryResults);
    }, [queryResults]);

    useEffect(() => {
        console.log("isQuerying set to this value");
        console.log(isQuerying);
    }, [isQuerying]);

    useEffect(() => {
        console.log(statistics, "stats have been received");
    }, [statistics]);

    function receiveData(tableData) {
        // console.log("calling receiveData");
        setDataState(tableData);
    }

    function receiveResults(results) {
        // console.log("calling receiveResults");
        // console.log(results);
        setResults(results);
    }

    function receiveQueryProgress(newProgress) {
        setQuerying(newProgress);
    }

    function receiveStats(newStats) {
        setStats(newStats);
    }

    return (
        <div className={classes.root}>
            <main className={classes.content}>
                {/*<div className={classes.appBarSpacer}/>*/}
                <Container maxWidth='lg' className={classes.container}>
                    <Grid container spacing={2} direction="row" justify="center"
                          alignItems="flex-start">
                        <Grid item container spacing={2} direction="column" lg={4}>
                            {/* current sequence selection thumbnail */}
                            <Grid item lg={12}>
                                <Paper className={classes.paper}>
                                    <CurrSeqSelection/>
                                </Paper>
                            </Grid>
                            {/* filters */}
                            <Grid item lg={12}>
                                <Paper className={classes.paper}>
                                    <Filter max_matches={max_matches}
                                            sendStats={receiveStats}
                                            sendProgress={receiveQueryProgress}
                                            sendResults={receiveResults}
                                            loi_min={props.loi_min}
                                            loi_max={props.loi_max}/>
                                </Paper>
                            </Grid>
                            {/*stats*/}
                            <Grid item lg={12}>
                                <Paper className={classes.paper}>
                                    <Stats statistics={statistics}/>
                                </Paper>
                            </Grid>
                        </Grid>
                        <Grid item container spacing={2} direction="row" lg={8}>
                            <Grid item lg={12}>
                                <LoadingOverlay
                                    active={isQuerying}
                                    spinner
                                    text='Querying in progress...'>
                                    <Paper className={fixedHeightChartPaper}>
                                        <ChartData data={receivedData}/>
                                    </Paper>
                                </LoadingOverlay>
                            </Grid>
                            <Grid item lg={12}>
                                {/* Table */}
                                <Paper className={fixedHeightTablePaper}>
                                    <DataTable queryResults={queryResults} sendData={receiveData}/>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Box pt={4}>
                        <Copyright/>
                    </Box>
                </Container>
            </main>
        </div>
    );
}
