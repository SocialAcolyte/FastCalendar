import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, differenceInWeeks, differenceInDays, addYears, isValid } from 'date-fns';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaSun, FaMoon, FaLock, FaUnlock, FaRedo } from 'react-icons/fa';
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
  background: ${props => props.dark
    ? 'linear-gradient(to bottom, #151d25, #34495e)'
    : 'linear-gradient(to bottom, #ecf0f1, #b5b5b5)'};
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
  background: ${props => props.dark
    ? 'linear-gradient(to bottom, #34495e, #304254)'
    : '#fff'};
  color: ${props => (props.dark ? '#ecf0f1' : '#2c3e50')};
`;

const MainContent = styled.div`
  display: flex;
  width: 100%;
  max-width: 1200px;
  gap: 20px;
`;

const CalendarWrapper = styled(motion.div)`
  flex: 1;
  padding: 20px;
  background: ${props => props.dark
    ? 'linear-gradient(to bottom, #34495e, #385269)'
    : 'linear-gradient(to bottom, #fff, #f9f9f9)'};
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const RightSection = styled.div`
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const LifeWeeksContainer = styled.div`
  padding: 20px;
  background: ${props => props.dark
    ? 'linear-gradient(to bottom, #34495e, #385269)'
    : 'linear-gradient(to bottom, #fff, #f9f9f9)'};
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
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

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: ${props => props.dark ? '#34495e' : 'white'};
  padding: 20px;
  border-radius: 10px;
  color: ${props => props.dark ? '#ecf0f1' : '#2c3e50'};
`;

// Components
const Clock = ({ dark, birthday, lifespanOption }) => {
  const [timePassedDisplay, setTimePassedDisplay] = useState('');

  useEffect(() => {
    if (!birthday || !lifespanOption) {
      setTimePassedDisplay('Enter birthday and lifespan');
      return;
    }

    const timer = setInterval(() => {
      const birthdayDate = new Date(birthday);
      const now = new Date();
      const lifespanYearsOptions = { unhealthy: 65, healthy: 80, bryan: 130 };
      const expectedLifespanYears = lifespanYearsOptions[lifespanOption];

      if (!isValid(birthdayDate) || birthdayDate >= now || !expectedLifespanYears) {
        setTimePassedDisplay('Invalid date or option');
        return;
      }

      const expectedDeath = addYears(birthdayDate, expectedLifespanYears);

      if (now > expectedDeath) {
        setTimePassedDisplay('Lifespan exceeded');
        clearInterval(timer);
        return;
      }

      const yearsPassed = differenceInWeeks(now, birthdayDate) / 52;
      const expectedYears = expectedLifespanYears;

      setTimePassedDisplay(`Years Passed: ${yearsPassed.toFixed(2)} / Expected: ${expectedYears}`);
    }, 1000);

    return () => clearInterval(timer);
  }, [birthday, lifespanOption]);

  return (
    <div style={{ textAlign: 'center', fontSize: '1.2rem', color: dark ? '#ecf0f1' : '#2c3e50' }}>
      Lifespan Clock: {timePassedDisplay}
    </div>
  );
};

const LifeWeeksDisplay = ({ dark, birthday, setBirthday, lifespanOption, setLifespanOption }) => {
  const [unit, setUnit] = useState('weeks');

  const lifespanYears = { unhealthy: 65, healthy: 80, bryan: 130 };
  const birthdayDate = new Date(birthday);
  const now = new Date();
  const isValidDate = isValid(birthdayDate) && birthdayDate < now;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Text copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

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
      <input
        type="date"
        value={birthday}
        onChange={e => setBirthday(e.target.value)}
        style={{ padding: '8px', margin: '10px 0', border: '1px solid #bdc3c7', borderRadius: '5px', background: dark ? '#2c3e50' : '#fff', color: dark ? '#ecf0f1' : '#2c3e50' }}
      />
      <div>
        {['unhealthy', 'healthy', 'bryan'].map(opt => (
          <TextButton
            key={opt}
            dark={dark}
            onClick={() => {
              setLifespanOption(opt);
              if (opt === 'bryan') {
                copyToClipboard(`PLACEHOLDER`);
              }
            }}
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
const MainApp = () => {
  const [calendarView, setCalendarView] = useState('day');
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [lockedIn, setLockedIn] = useState(false);
  const [parseErrors, setParseErrors] = useState([]);
  const [lastInput, setLastInput] = useState('');
  const [calendarHeight, setCalendarHeight] = useState(800);
  const [birthday, setBirthday] = useState('');
  const [lifespanOption, setLifespanOption] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null); // New state for selected event
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
        newEvents.push({ title: title.trim(), start, end, color: '#3788d8' }); // Added color property
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
        const scrollPosition = fraction * calendarHeight - scrollContainer.clientHeight / 2;
        scrollContainer.scrollTop = scrollPosition;
      }
    }
  }, [lockedIn, calendarHeight]);

  // Custom event component for colored events
  const CustomEvent = ({ event }) => (
    <div style={{ backgroundColor: event.color, color: 'white', padding: '5px', borderRadius: '5px' }}>
      {event.title}
    </div>
  );

  return (
    <AppContainer dark={darkMode}>
      <Header dark={darkMode} initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }}>
        <FaCalendarAlt /> Fast Calendar
        <IconButton dark={darkMode} onClick={() => setDarkMode(!darkMode)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          {darkMode ? <FaSun /> : <FaMoon />}
        </IconButton>
        <IconButton dark={darkMode} onClick={() => setLockedIn(!lockedIn)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          {lockedIn ? <FaUnlock /> : <FaLock />}
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
      <MainContent>
        <CalendarWrapper ref={calendarWrapperRef} dark={darkMode} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
            <div>
              <TextButton dark={darkMode} onClick={() => setCalendarHeight(prev => prev + 100)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                Increase Size
              </TextButton>
              <TextButton dark={darkMode} onClick={() => setCalendarHeight(prev => Math.max(prev - 100, 300))} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                Decrease Size
              </TextButton>
            </div>
          </div>
          <Calendar
            localizer={localizer}
            events={events}
            view={calendarView}
            onView={(newView) => setCalendarView(newView)}
            date={calendarDate}
            onNavigate={(newDate) => setCalendarDate(newDate)}
            step={15} // Fixed value, density removed
            timeslots={4} // Fixed value, density removed
            views={['day', 'week', 'month']}
            style={{ height: `${calendarHeight}px` }}
            onSelectEvent={(event) => setSelectedEvent(event)} // Added event selection
            components={{ event: CustomEvent }} // Custom event rendering
          />
          {selectedEvent && (
            <ModalOverlay initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModalContent dark={darkMode}>
                <h2>{selectedEvent.title}</h2>
                <p>Start: {format(selectedEvent.start, 'PPpp')}</p>
                <p>End: {format(selectedEvent.end, 'PPpp')}</p>
                <button
                  onClick={() => {
                    const text = `Title: ${selectedEvent.title}\nStart: ${format(selectedEvent.start, 'PPpp')}\nEnd: ${format(selectedEvent.end, 'PPpp')}`;
                    navigator.clipboard.writeText(text).then(() => alert('Event details copied to clipboard'));
                  }}
                >
                  Share
                </button>
                <input
                  type="color"
                  value={selectedEvent.color}
                  onChange={(e) => {
                    const newColor = e.target.value;
                    setEvents(prevEvents => prevEvents.map(ev => ev === selectedEvent ? { ...ev, color: newColor } : ev));
                  }}
                  style={{ marginLeft: '10px' }}
                />
                <button onClick={() => setSelectedEvent(null)} style={{ marginLeft: '10px' }}>Close</button>
              </ModalContent>
            </ModalOverlay>
          )}
        </CalendarWrapper>
        <RightSection>
          <Clock dark={darkMode} birthday={birthday} lifespanOption={lifespanOption} />
          <LifeWeeksDisplay dark={darkMode} birthday={birthday} setBirthday={setBirthday} lifespanOption={lifespanOption} setLifespanOption={setLifespanOption} />
        </RightSection>
      </MainContent>
    </AppContainer>
  );
};


// App Component with Routing
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/main" element={<MainApp />} />
      </Routes>
    </Router>
  );
};

export default App;