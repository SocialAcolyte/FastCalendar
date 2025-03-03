import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import { differenceInWeeks, differenceInDays, addYears, isValid } from 'date-fns'; // Added for life weeks calculations
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaClock, FaPlus, FaSun, FaMoon, FaLock, FaUnlock, FaCalendarWeek } from 'react-icons/fa'; // Added FaCalendarWeek
import 'react-big-calendar/lib/css/react-big-calendar.css';


// Date-fns setup
const locales = { 'en-US': require('date-fns/locale/en-US') };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Styled Components
const AppContainer = styled.div`
  padding: 40px;
  max-width: 1600px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
  background: ${props =>
    props.dark
      ? 'radial-gradient(circle at top left, #1a1a2e, #16213e)'
      : 'radial-gradient(circle at top left, #f4f6f9, #e9ecef)'};
  min-height: 100vh;
  transition: background 0.3s ease;
  position: relative;
  overflow: hidden;
`;

const Header = styled(motion.h1)`
  font-size: clamp(1.8rem, 2.2vw, 2.2rem);
  font-weight: 600;
  color: ${props => (props.dark ? '#e0e0e0' : '#2c3e50')};
  text-shadow: ${props => (props.dark ? '0 2px 4px rgba(0, 0, 0, 0.5)' : '0 1px 2px rgba(0, 0, 0, 0.1)')};
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 25px;
`;

const ThemeToggle = styled(motion.button)`
  border-radius: 50%;
  padding: 10px;
  border: 1px solid ${props => (props.dark ? '#ffd700' : '#ffa500')};
  background: transparent;
  color: ${props => (props.dark ? '#ffd700' : '#ffa500')};
  font-size: 1.5rem;
  cursor: pointer;
  margin-left: auto;
  transition: background 0.3s ease, transform 0.2s ease;
  &:hover {
    background: ${props => (props.dark ? '#3a3a5a' : '#e0e0e0')};
    transform: scale(1.1);
  }
`;

const LockButton = styled(motion.button)`
  border-radius: 50%;
  padding: 10px;
  border: 1px solid ${props => (props.dark ? '#ffd700' : '#ffa500')};
  background: transparent;
  color: ${props => (props.dark ? '#ffd700' : '#ffa500')};
  font-size: 1.5rem;
  cursor: pointer;
  margin-left: 10px;
  transition: background 0.3s ease, transform 0.2s ease;
  &:hover {
    background: ${props => (props.dark ? '#3a3a5a' : '#e0e0e0')};
    transform: scale(1.1);
  }
`;

const LifeWeeksToggle = styled(motion.button)`
  border-radius: 50%;
  padding: 10px;
  border: 1px solid ${props => (props.dark ? '#ffd700' : '#ffa500')};
  background: transparent;
  color: ${props => (props.dark ? '#ffd700' : '#ffa500')};
  font-size: 1.5rem;
  cursor: pointer;
  margin-left: 10px;
  transition: background 0.3s ease, transform 0.2s ease;
  &:hover {
    background: ${props => (props.dark ? '#3a3a5a' : '#e0e0e0')};
    transform: scale(1.1);
  }
`;

const InputWrapper = styled.div`
  position: relative;
  margin-bottom: 35px;
`;

const Input = styled(motion.input)`
  width: 100%;
  padding: 16px 50px 16px 20px;
  font-size: 1.1rem;
  border: none;
  border-radius: 10px;
  background: ${props => (props.dark ? '#2a2a3e' : '#ffffff')};
  color: ${props => (props.dark ? '#e0e0e0' : '#333')};
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
  outline: none;
  transition: box-shadow 0.3s ease, background 0.3s ease, transform 0.3s ease;
  &::placeholder {
    color: ${props => (props.dark ? '#888' : '#aaa')};
    opacity: 0.8;
  }
  &:focus {
    box-shadow: 0 8px 25px rgba(0, 123, 255, 0.3);
    transform: scale(1.02);
  }
`;

const InputIcon = styled(FaPlus)`
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #007bff;
  font-size: 1.3rem;
  transition: color 0.3s ease;
`;

const CalendarWrapper = styled(motion.div)`
  background: ${props => (props.dark ? 'rgba(42, 42, 62, 0.8)' : 'rgba(255, 255, 255, 0.8)')};
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  padding: 25px;
  overflow: hidden;
  transition: background 0.3s ease;
  border: 1px solid ${props => (props.dark ? '#3a3a5a' : '#e0e0e0')};
  margin-top: 20px;
  .rbc-event {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .rbc-event:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

const LifeWeeksContainer = styled.div`
  background: ${props => (props.dark ? 'rgba(42, 42, 62, 0.8)' : 'rgba(255, 255, 255, 0.8)')};
  border-radius: 12px;
  padding: 20px;
  margin-top: 20px;
  color: ${props => (props.dark ? '#e0e0e0' : '#333')};
  border: 1px solid ${props => (props.dark ? '#555' : '#ccc')};
`;

const LifeWeeksInput = styled.input`
  padding: 10px 30px 10px 10px;
  border-radius: 5px;
  border: 1px solid ${props => (props.dark ? '#555' : '#ccc')};
  background: ${props => (props.dark ? '#2a2a3e' : '#fff')};
  color: ${props => (props.dark ? '#e0e0e0' : '#333')};
  margin-bottom: 20px;
  appearance: none;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="${props => (props.dark ? '#888' : '#aaa')}" viewBox="0 0 16 16"><path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/><path d="M6.5 7a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1H7a.5.5 0 0 1-.5-.5z"/></svg>');
  background-position: right 10px center;
  background-repeat: no-repeat;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
  motion.button {
    border-radius: 0;
    border-right: 1px solid ${props => (props.dark ? '#555' : '#ccc')};
    &:last-child {
      border-right: none;
    }
  }
`;

const GridContainer = styled.div`
  height: 600px;
  overflow-y: auto;
  background: ${props => (props.dark ? '#2a2a3e' : '#ffffff')};
  padding: 10px;
  border-radius: 8px;
  border: 1px solid ${props => (props.dark ? '#555' : '#ccc')};
`;``

const LifeWeeksDisplay = ({ dark }) => {
  const [birthday, setBirthday] = useState('');
  const [lifespanOption, setLifespanOption] = useState(null); // 'unhealthy', 'healthy', 'bryan'
  const [unit, setUnit] = useState('weeks'); // 'weeks' or 'days'

  const handleBirthdayChange = (e) => {
    setBirthday(e.target.value);
  };

  let content;
  if (!birthday || !lifespanOption) {
    content = <p>Please enter your birthday and select a lifespan option.</p>;
  } else {
    const birthdayDate = new Date(birthday);
    const now = new Date();
    if (!isValid(birthdayDate) || birthdayDate >= now) {
      content = <p>Please enter a valid birthday in the past.</p>;
    } else {
      const lifespanYears = {
        unhealthy: 65,
        healthy: 80,
        bryan: 130,
      }[lifespanOption];
      const expectedDeath = addYears(birthdayDate, lifespanYears);
      let totalUnits, passedUnits;
      if (unit === 'weeks') {
        totalUnits = differenceInWeeks(expectedDeath, birthdayDate);
        passedUnits = differenceInWeeks(now, birthdayDate);
      } else {
        totalUnits = differenceInDays(expectedDeath, birthdayDate);
        passedUnits = differenceInDays(now, birthdayDate);
      }
      const rows = unit === 'weeks' ? lifespanYears : Math.ceil(totalUnits / 7);
      const columns = unit === 'weeks' ? 52 : 7;
      const dots = Array.from({ length: totalUnits }, (_, i) => (
        <circle
          key={i}
          cx={(i % columns) * 10 + 5}
          cy={Math.floor(i / columns) * 10 + 5}
          r={3}
          fill={i < passedUnits ? (dark ? '#555' : '#ccc') : (dark ? '#aaa' : '#333')}
        />
      ));
      content = (
        <svg width={columns * 10} height={rows * 10}>
          {dots}
        </svg>
      );
    }
  }

  return (
    <LifeWeeksContainer dark={dark}>
      <h2>Life Weeks</h2>
      <LifeWeeksInput
        type="date"
        value={birthday}
        onChange={handleBirthdayChange}
        dark={dark}
      />
      <ButtonGroup>
        <motion.button
          onClick={() => setLifespanOption('unhealthy')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: lifespanOption === 'unhealthy' ? (dark ? '#ffd700' : '#ffa500') : 'transparent',
            color: dark ? '#e0e0e0' : '#333',
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Unhealthy (65 years)
        </motion.button>
        <motion.button
          onClick={() => setLifespanOption('healthy')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: lifespanOption === 'healthy' ? (dark ? '#ffd700' : '#ffa500') : 'transparent',
            color: dark ? '#e0e0e0' : '#333',
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Healthy (80 years)
        </motion.button>
        <motion.button
          onClick={() => setLifespanOption('bryan')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: lifespanOption === 'bryan' ? (dark ? '#ffd700' : '#ffa500') : 'transparent',
            color: dark ? '#e0e0e0' : '#333',
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Bryan Johnson (130 years)
        </motion.button>
      </ButtonGroup>
      <ButtonGroup>
        <motion.button
          onClick={() => setUnit('weeks')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: unit === 'weeks' ? (dark ? '#ffd700' : '#ffa500') : 'transparent',
            color: dark ? '#e0e0e0' : '#333',
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Weeks
        </motion.button>
        <motion.button
          onClick={() => setUnit('days')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: unit === 'days' ? (dark ? '#ffd700' : '#ffa500') : 'transparent',
            color: dark ? '#e0e0e0' : '#333',
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Days
        </motion.button>
      </ButtonGroup>
      <GridContainer>
        {content}
      </GridContainer>
    </LifeWeeksContainer>
  );
};

const App = () => {
  const [events, setEvents] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [lockedIn, setLockedIn] = useState(false);
  const [showLifeWeeks, setShowLifeWeeks] = useState(false); // Added for toggling life weeks
  const calendarWrapperRef = useRef(null);
  const today = new Date();

  // Parse events from input
  const parseEvents = (input) => {
    if (!input.trim()) return;
    const eventStrings = input.split(';').map(str => str.trim());
    const newEvents = eventStrings
      .map(eventStr => {
        try {
          const match = eventStr.match(/^\[?(.*?)\]?\s*(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})\s*(am|pm)$/i);
          if (!match) throw new Error('Invalid format');
          const [, title, startTime, endTime, period] = match;
          const start = parse(`${startTime} ${period}`, 'h:mm a', today);
          const end = parse(`${endTime} ${period}`, 'h:mm a', today);
          if (end < start) end.setDate(end.getDate() + 1);
          return { title: title.trim(), start, end };
        } catch (error) {
          console.error(`Failed to parse event: ${eventStr}`, error);
          return null;
        }
      })
      .filter(Boolean);
    setEvents(prev => [...prev, ...newEvents]);
  };

  const handleInput = e => {
    if (e.key === 'Enter') {
      parseEvents(e.target.value);
      e.target.value = '';
    }
  };

  // Dynamic height calculation
  const maxOverlaps = useMemo(() => {
    const timeSlots = {};
    events.forEach(event => {
      const startHour = event.start.getHours();
      const endHour = event.end.getHours();
      for (let h = startHour; h <= endHour; h++) {
        timeSlots[h] = (timeSlots[h] || 0) + 1;
      }
    });
    return Math.max(...Object.values(timeSlots), 0);
  }, [events]);

  const baseHeightPerHour = 200;
  const extraHeightPerOverlap = 50;
  const dynamicHeight = 24 * baseHeightPerHour + maxOverlaps * extraHeightPerOverlap;
  const fontSize = Math.max(0.7, 1 - maxOverlaps * 0.05);

  // Event styling
  const eventPropGetter = event => {
    const now = new Date();
    const isCurrent = event.start <= now && event.end >= now;
    return {
      style: {
        background: isCurrent
          ? 'linear-gradient(135deg, #28a745, #20c997)'
          : darkMode
          ? 'linear-gradient(135deg, #007bff, #00c4ff)'
          : 'linear-gradient(135deg, #007bff, #6610f2)',
        color: 'white',
        borderRadius: '6px',
        border: 'none',
        fontSize: `${fontSize}rem`,
        padding: '2px 6px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        filter: lockedIn && !isCurrent ? 'blur(2px)' : 'none',
        opacity: lockedIn && !isCurrent ? 0.5 : 1,
      },
    };
  };

  // Lock-in scrolling
  useEffect(() => {
    if (calendarWrapperRef.current && lockedIn) {
      const scrollContainer = calendarWrapperRef.current.querySelector('.rbc-time-content');
      if (scrollContainer) {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const fractionOfDay = (now - startOfDay) / (24 * 60 * 60 * 1000);
        const scrollPosition = fractionOfDay * dynamicHeight;
        const viewHeight = scrollContainer.clientHeight;
        scrollContainer.scrollTop = scrollPosition - viewHeight / 2;
      } else {
        console.warn('Scroll container not found');
      }
    }
  }, [lockedIn, dynamicHeight]);

  // Animation variants
  const headerVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, type: 'spring', stiffness: 120 } },
  };

  const inputVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, type: 'spring', stiffness: 150 } },
  };

  const calendarVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, type: 'spring', stiffness: 100 } },
  };

  return (
    <AppContainer dark={darkMode}>
      <Header variants={headerVariants} initial="hidden" animate="visible" dark={darkMode}>
        <FaCalendarAlt /> Fast Calendar
        <ThemeToggle
          dark={darkMode}
          onClick={() => setDarkMode(!darkMode)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </ThemeToggle>
        <LockButton
          dark={darkMode}
          onClick={() => setLockedIn(!lockedIn)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {lockedIn ? <FaUnlock /> : <FaLock />}
        </LockButton>
        <LifeWeeksToggle
          dark={darkMode}
          onClick={() => setShowLifeWeeks(!showLifeWeeks)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaCalendarWeek />
        </LifeWeeksToggle>
      </Header>

      <InputWrapper>
        <Input
          dark={darkMode}
          placeholder="e.g., Meeting with Team 9:00-10:00 am; Lunch 12:00-1:00 pm"
          onKeyDown={handleInput}
          variants={inputVariants}
          initial="hidden"
          animate="visible"
        />
        <InputIcon />
      </InputWrapper>

      <CalendarWrapper
        ref={calendarWrapperRef}
        dark={darkMode}
        variants={calendarVariants}
        initial="hidden"
        animate="visible"
      >
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          defaultView="day"
          views={['day', 'week', 'month']}
          step={5}
          timeslots={12}
          style={{ height: `${dynamicHeight}px`, transition: 'height 0.4s ease' }}
          eventPropGetter={eventPropGetter}
          scrollToTime={new Date()}
          components={{
            event: ({ event }) => {
              const now = new Date();
              const isCurrent = event.start <= now && event.end >= now;
              const progress = isCurrent
                ? ((now - event.start) / (event.end - event.start)) * 100
                : 0;
              return (
                <motion.div
                  style={{ position: 'relative', width: '100%', height: '100%' }}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    scale: isCurrent && lockedIn ? 1.05 : 1,
                    boxShadow: isCurrent && lockedIn
                      ? '0 4px 12px rgba(0, 0, 0, 0.3)'
                      : '0 2px 8px rgba(0, 0, 0, 0.15)',
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <span>
                    <FaClock style={{ marginRight: '4px', fontSize: `${fontSize}rem` }} />
                    {event.title}
                  </span>
                  {isCurrent && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        height: '4px',
                        width: `${progress}%`,
                        background: 'rgba(255, 255, 255, 0.5)',
                        transition: 'width 1s linear',
                      }}
                    />
                  )}
                </motion.div>
              );
            },
            toolbar: ({ label, onView, onNavigate }) => (
              <motion.div
                className="rbc-toolbar"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 0',
                }}
              >
                <div style={{ display: 'flex', gap: '10px' }}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      background: darkMode ? '#3a3a5a' : '#e0e0e0',
                      color: darkMode ? '#e0e0e0' : '#333',
                      cursor: 'pointer',
                    }}
                    onClick={() => onNavigate('TODAY')}
                  >
                    Today
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      background: darkMode ? '#3a3a5a' : '#e0e0e0',
                      color: darkMode ? '#e0e0e0' : '#333',
                      cursor: 'pointer',
                    }}
                    onClick={() => onNavigate('PREV')}
                  >
                    Back
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      background: darkMode ? '#3a3a5a' : '#e0e0e0',
                      color: darkMode ? '#e0e0e0' : '#333',
                      cursor: 'pointer',
                    }}
                    onClick={() => onNavigate('NEXT')}
                  >
                    Next
                  </motion.button>
                </div>
                <span
                  style={{
                    color: darkMode ? '#e0e0e0' : '#2c3e50',
                    fontWeight: 600,
                    fontSize: '1.2rem',
                  }}
                >
                  {label}
                </span>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      background: darkMode ? '#3a3a5a' : '#e0e0e0',
                      color: darkMode ? '#e0e0e0' : '#333',
                      cursor: 'pointer',
                    }}
                    onClick={() => onView('day')}
                  >
                    Day
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      background: darkMode ? '#3a3a5a' : '#e0e0e0',
                      color: darkMode ? '#e0e0e0' : '#333',
                      cursor: 'pointer',
                    }}
                    onClick={() => onView('week')}
                  >
                    Week
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      background: darkMode ? '#3a3a5a' : '#e0e0e0',
                      color: darkMode ? '#e0e0e0' : '#333',
                      cursor: 'pointer',
                    }}
                    onClick={() => onView('month')}
                  >
                    Month
                  </motion.button>
                </div>
              </motion.div>
            ),
          }}
        />
      </CalendarWrapper>
      {showLifeWeeks && <LifeWeeksDisplay dark={darkMode} />}
    </AppContainer>
  );
};

export default App;