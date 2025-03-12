import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, differenceInWeeks, differenceInDays, addYears, isValid, addDay } from 'date-fns';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useLocalStorage } from './hooks/useLocalStorage';
import { FaCalendarAlt, FaSun, FaMoon, FaLock, FaUnlock, FaAdjust, FaBirthdayCake, FaAirFreshener, FaRedoAlt } from 'react-icons/fa';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// end of imports

// DateFns Localizer
const locales = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
  locales: { 'en-US': require('date-fns/locale/en-US') },
});

// Styled Components

    // app container
const AppContainer = styled(motion.div)`
padding: 20px;
background: ${props => props.dark
    ? 'linear-gradient(135deg, #2c3e50, #4ca1af)'}
    : 'linear-gradient(135deg, #f5f7fa, #c3cfe2)'};
color: ${props => props.dark ? '#ecf0f1' : '#2c3e50'};
min-height: 100vh;
display: flex;
flex-direction: column;
align-items: center;
`;

    // header
const Header = styled(motion.header)`
display: flex;
align-items: center;
gap: 10px;
margin-bottom: 20px;
font-size: 1.5rem;
font-weight: bold;
width: 100%;
max-width: 1200px;
`;

    // dark mode toggle button

const DarkModeButton = styled(motion.button)`
background: none;
border: none;
cursor: pointer;
`;

    // input wrapper
const InputWrapper = styled.div`
position: relative;
margin-bottom: 20px;
width: 100%;
max-width: 600px;
display: flex;
align-items: center;
`;

    // input
const Input = styled(motion.input)`
flex: 1;
padding: 10px 40px 10px 10px;
border: 1px solid ${props => props.dark ? '#333' : '#ccc'};
border-radius: 5px;
background: ${props => props.dark ? '#2c3e50' : '#fff'};
color: ${props => props.dark ? '#ecf0f1' : '#2c3e50'};
transition: border-color 0.4s;
&:focus {
    outline: none;
    border-color: ${props => props.dark ? '#3498db' : '#2980b9'};
}
`;

    // icon wrapper
const IconWrapper = styled.div`
position: absolute;
right: 10px;
top: 50%;
transform: translateY(-50%);
boxshadow: 0 0 5px rgba(0, 0, 0, 0.1);
hover: cursor: pointer;
`;

    //calendar wrapper
const CalendarWrapper = styled(motion.div)`
flex: 1;
padding: 20px;
background: ${props => props.dark
    ? 'linear-gradient(135deg, #2c3e50, #4ca1af)'}
    : 'linear-gradient(135deg, #f5f7fa, #c3cfe2)'};
border-radius: 10px;
box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
width: 100%;
max-width: 1200px;
`;

    // right section
const RightSection = styled.div`
width: 100%;
max-width: 600px;
display: flex;
flex-direction: column;
gap: 20px;
`;

    // life weeks container
const LifeWeeksContainer = styled.div`
display: flex;
padding: 20px;
background: ${props => props.dark
    ? 'linear-gradient(135deg, #2c3e50, #4ca1af)'}
    : 'linear-gradient(135deg, #f5f7fa, #c3cfe2)'};
border-radius: 10px;
box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
width: 100%;
max-width: 600px;
`;

    // icon button
const IconButton = styled(motion.button)`
background: none;
border: none;
cursor: pointer;
color: ${props => props.dark ? '#ecf0f1' : '#2c3e50'};
font-size: 1.2rem;
margin-left: 10px;
transition: color 0.4s;
&:hover {
    color: ${props => props.dark ? '#3498db' : '#2980b9'};
}
`;

    // text button
const TextButton = styled(motion.button)`
background: ${props => (props.active ? (props.dark ? '#333' : '#ccc') 'transparent')}: 'none'};
`;

    // text button
