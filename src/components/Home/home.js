import React from 'react';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import Header from '../header/header'
import Perfil from '../check-frequency/check-frequency'
import History from '../history-frequency/history'

import UTILS from '../history-frequency/UTILS.js'

const $ = require('jquery');

interface TabPanelProps {
    children?: React.ReactNode;
    dir?: string;
    index: any;
    value: any;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            <Box p={3}>{children}</Box>
        </Typography>
    );
}

function a11yProps(index: any) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        width: 500,
    },
}));

export default function FullWidthTabs() {
    const classes = useStyles();
    const theme = useTheme();
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
        getExtrato();
    };

    const handleChangeIndex = (index: number) => {
        setValue(index);
    };

    return (
        <div>
            <div className="div-header">
                <Header />
                <AppBar position="static" color="default">
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                        aria-label="Frequency"
                    >
                        <Tab label="Perfil" {...a11yProps(0)} />
                        <Tab label="Histórico" {...a11yProps(1)} />
                    </Tabs>
                </AppBar>
            </div>
            <SwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={value}
                onChangeIndex={handleChangeIndex}
            >
                <TabPanel value={value} index={0} dir={theme.direction} className="tab">
                    <Perfil />
                </TabPanel>
                <TabPanel value={value} index={1} dir={theme.direction} className="tab">
                    <History />
                </TabPanel>
            </SwipeableViews>
        </div>
    );
}

function getExtrato() {
    $(".div-extrato .card-extrato").remove()

    $("#input-dt-inicio").val(" ");
    $("#input-dt-fim").val(" ");

    var matriculaAluno = localStorage.getItem("matricula");
    UTILS.getExtrato(`?matricula=${matriculaAluno}&dtInicio=0&dtFim=0`);
}