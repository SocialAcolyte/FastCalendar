import React, { useState, useRef, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, differenceInWeeks, differenceInDays, addYears, isValid } from 'date-fns';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendarAlt, FaSun, FaMoon, FaLock, FaUnlock, FaCalendarWeek, FaRedo } from 'react-icons/fa';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Date-fns setup
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { 'en-US': require('date-fns/locale/en-US') },
});

// Styled Components
const AppContainer = styled(motion.div)`
  padding: 20px;
  background: ${props => (props.dark ? '#2c3e50' : '#ecf0f1')};
  color: ${props => (props.dark ? '#ecf0f1' : '#2c3e50')};
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled(motion.header)`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  font-size: 1.5rem;
  font-weight: bold;
  width: 100%;
  max-width: 1200px;
`;

const InputWrapper = styled.div`
  position: relative;
  margin-bottom: 20px;
  width: 100%;
  max-width: 600px;
  display: flex;
  align-items: center;
`;

const Input = styled(motion.input)`
  flex: 1;
  padding: 10px 40px 10px 10px;
  border: 1px solid ${props => (props.dark ? '#95a5a6' : '#bdc3c7')};
  border-radius: 5px;
  background: ${props => (props.dark ? '#34495e' : '#fff')};
  color: ${props => (props.dark ? '#ecf0f1' : '#2c3e50')};
`;

const CalendarWrapper = styled(motion.div)`
  padding: 20px;
  background: ${props => (props.dark ? '#34495e' : '#fff')};
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  width: 100%;
  max-width: 1200px;
`;

const LifeWeeksContainer = styled.div`
  padding: 20px;
  background: ${props => (props.dark ? '#34495e' : '#fff')};
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 1200px;
`;

const LifeWeeksInput = styled.input`
  padding: 8px;
  margin: 10px 0;
  border: 1px solid ${props => (props.dark ? '#95a5a6' : '#bdc3c7')};
  border-radius: 5px;
  background: ${props => (props.dark ? '#2c3e50' : '#fff')};
  color: ${props => (props.dark ? '#ecf0f1' : '#2c3e50')};
`;

const IconButton = styled(motion.button)`
  background: none;
  border: none;
  color: ${props => (props.dark ? '#ecf0f1' : '#2c3e50')};
  cursor: pointer;
  font-size: 1.2rem;
  margin-left: 10px;
`;

const TextButton = styled(motion.button)`
  background: ${props => (props.active ? (props.dark ? '#95a5a6' : '#bdc3c7') : 'none')};
  border: 1px solid ${props => (props.dark ? '#95a5a6' : '#bdc3c7')};
  border-radius: 5px;
  padding: 5px 10px;
  margin: 5px;
  color: ${props => (props.dark ? '#ecf0f1' : '#2c3e50')};
  cursor: pointer;
`;

const LandingContainer = styled(motion.div)`
  text-align: center;
  margin-top: 20%;
`;

// Landing Page Component
const LandingPage = ({ onEnter }) => (
  <LandingContainer
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <h1>Don't Die</h1>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onEnter}
      style={{
        padding: '10px 20px',
        fontSize: '1.2rem',
        borderRadius: '5px',
        border: 'none',
        background: '#3498db',
        color: '#fff',
        cursor: 'pointer',
      }}
    >
      Enter
    </motion.button>
  </LandingContainer>
);

// Life Weeks Component
const LifeWeeksDisplay = ({ dark }) => {
  const [birthday, setBirthday] = useState('');
  const [lifespanOption, setLifespanOption] = useState(null);
  const [unit, setUnit] = useState('weeks');

  const lifespanYears = { unhealthy: 65, healthy: 80, bryan: 130 };
  const birthdayDate = new Date(birthday);
  const now = new Date();
  const isValidDate = isValid(birthdayDate) && birthdayDate < now;

  let content;
  if (!birthday || !lifespanOption || !isValidDate) {
    content = <p>Please enter a valid birthday and select a lifespan option.</p>;
  } else {
    const expectedDeath = addYears(birthdayDate, lifespanYears[lifespanOption]);
    const [totalUnits, passedUnits] = unit === 'weeks'
      ? [differenceInWeeks(expectedDeath, birthdayDate), differenceInWeeks(now, birthdayDate)]
      : [differenceInDays(expectedDeath, birthdayDate), differenceInDays(now, birthdayDate)];
    const [rows, cols] = unit === 'weeks' ? [lifespanYears[lifespanOption], 52] : [Math.ceil(totalUnits / 7), 7];
    const dots = Array.from({ length: totalUnits }, (_, i) => (
      <circle
        key={i}
        cx={(i % cols) * 10 + 5}
        cy={Math.floor(i / cols) * 10 + 5}
        r={3}
        fill={i < passedUnits ? (dark ? '#333' : '#ccc') : (dark ? '#aaa' : '#222')}
      />
    ));
    content = <svg width={cols * 10} height={rows * 10}>{dots}</svg>;
  }

  return (
    <LifeWeeksContainer dark={dark}>
      <h2>Life Weeks</h2>
      <LifeWeeksInput
        type="date"
        value={birthday}
        onChange={e => setBirthday(e.target.value)}
        dark={dark}
      />
      <div>
        {['unhealthy', 'healthy', 'bryan'].map(opt => (
          <TextButton
            key={opt}
            dark={dark}
            onClick={() => setLifespanOption(opt)}
            active={lifespanOption === opt}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {opt === 'bryan' ? 'Bryan Johnson (130 years)' : `${opt.charAt(0).toUpperCase() + opt.slice(1)} (${lifespanYears[opt]} years)`}
          </TextButton>
        ))}
      </div>
      <div>
        {['weeks', 'days'].map(u => (
          <TextButton
            key={u}
            dark={dark}
            onClick={() => setUnit(u)}
            active={unit === u}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {u.charAt(0).toUpperCase() + u.slice(1)}
          </TextButton>
        ))}
      </div>
      <div>{content}</div>
    </LifeWeeksContainer>
  );
};

// Main App Component
const App = () => {
  const [events, setEvents] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [lockedIn, setLockedIn] = useState(false);
  const [showLifeWeeks, setShowLifeWeeks] = useState(false);
  const [parseErrors, setParseErrors] = useState([]);
  const [showLanding, setShowLanding] = useState(true);
  const [lastInput, setLastInput] = useState('');
  const calendarWrapperRef = useRef(null);

  const parseEvents = (input, referenceDate) => {
    if (!input.trim()) return;
    const eventStrings = input.split(';').map(str => str.trim());
    const newEvents = [];
    const errors = [];
    eventStrings.forEach(str => {
      const match = str.match(/^\[?(.*?)\]?\s*(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})\s*(am|pm)$/i);
      if (match) {
        const [, title, startTime, endTime, period] = match;
        const start = parse(`${startTime} ${period}`, 'h:mm a', referenceDate);
        const end = parse(`${endTime} ${period}`, 'h:mm a', referenceDate);
        if (end < start) end.setDate(end.getDate() + 1);
        newEvents.push({ title: title.trim(), start, end });
      } else {
        errors.push(`Invalid event: ${str}`);
      }
    });
    setEvents(prev => [...prev, ...newEvents]);
    setParseErrors(errors);
  };

  const repeatEvents = () => {
    if (lastInput) {
      const nextDay = new Date();
      nextDay.setDate(nextDay.getDate() + 1);
      parseEvents(lastInput, nextDay);
    }
  };

  useEffect(() => {
    if (lockedIn && calendarWrapperRef.current) {
      const scrollContainer = calendarWrapperRef.current.querySelector('.rbc-time-content');
      if (scrollContainer) {
        const now = new Date();
        const startOfDay = new Date(now.setHours(0, 0, 0, 0));
        const fraction = (now - startOfDay) / (24 * 60 * 60 * 1000);
        const scrollPosition = fraction * 800 - scrollContainer.clientHeight / 2;
        scrollContainer.scrollTop = scrollPosition;
      }
    }
  }, [lockedIn]);

  return (
    <AppContainer dark={darkMode}>
      <AnimatePresence>
        {showLanding ? (
          <LandingPage key="landing" onEnter={() => setShowLanding(false)} />
        ) : (
          <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Header dark={darkMode} initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }}>
              <FaCalendarAlt /> Fast Calendar
              <IconButton dark={darkMode} onClick={() => setDarkMode(!darkMode)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                {darkMode ? <FaSun /> : <FaMoon />}
              </IconButton>
              <IconButton dark={darkMode} onClick={() => setLockedIn(!lockedIn)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                {lockedIn ? <FaUnlock /> : <FaLock />}
              </IconButton>
              <IconButton dark={darkMode} onClick={() => setShowLifeWeeks(!showLifeWeeks)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <FaCalendarWeek />
              </IconButton>
            </Header>
            <InputWrapper>
              <Input
                dark={darkMode}
                placeholder="e.g., Meeting 9:00-10:00 am; Lunch 12:00-1:00 pm"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    const inputValue = e.target.value;
                    parseEvents(inputValue, new Date());
                    setLastInput(inputValue);
                    e.target.value = '';
                  }
                }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              />
              <IconButton dark={darkMode} onClick={repeatEvents} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <FaRedo />
              </IconButton>
              {parseErrors.length > 0 && (
                <div style={{ color: 'red', marginTop: '10px' }}>
                  {parseErrors.map((err, i) => <p key={i}>{err}</p>)}
                </div>
              )}
            </InputWrapper>
            <CalendarWrapper ref={calendarWrapperRef} dark={darkMode} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
              <Calendar
                localizer={localizer}
                events={events}
                defaultView="day"
                views={['day', 'week', 'month']}
                step={5}
                timeslots={12}
                defaultDate={new Date()}
                style={{ height: '800px' }}
              />
            </CalendarWrapper>
            {showLifeWeeks && <LifeWeeksDisplay dark={darkMode} />}
          </motion.div>
        )}
      </AnimatePresence>
    </AppContainer>
  );
};

export default App;