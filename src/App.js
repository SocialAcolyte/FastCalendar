import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, differenceInWeeks, addYears, isValid } from 'date-fns';
import styled, { createGlobalStyle } from 'styled-components';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { enUS } from 'date-fns/locale';

// Date-fns localizer setup
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { 'en-US': enUS },
});

// Global Styles
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: sans-serif;
    background: #121212;
    color: #64B5F6;
  }
`;

// Styled Components
const AppContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
  font-size: 2rem;
  font-weight: bold;
  width: 100%;
  max-width: 1200px;
  color: #64B5F6;
  padding-bottom: 10px;
  border-bottom: 1px solid #1E1E1E;
`;

const Input = styled.input`
  flex: 1;
  padding: 12px 15px;
  border: 1px solid #64B5F6;
  border-radius: 8px;
  background: #1E1E1E;
  color: #64B5F6;
  margin-bottom: 25px;
  width: 100%;
  max-width: 600px;
  font-size: 1rem;
  &::placeholder {
    color: #90CAF9;
  }
  &:focus {
    outline: none;
    border-color: #BBDEFB;
    box-shadow: 0 0 5px rgba(100, 181, 246, 0.5);
  }
`;

const MainContent = styled.div`
  display: flex;
  width: 100%;
  max-width: 1200px;
  gap: 30px;
  @media (max-width: 960px) {
    flex-direction: column;
  }
`;

const CalendarWrapper = styled.div`
  flex: 1;
  padding: 25px;
  background: #1E1E1E;
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.6);
`;

const RightSection = styled.div`
  width: 350px;
  display: flex;
  flex-direction: column;
  gap: 25px;
  @media (max-width: 960px) {
    width: 100%;
  }
`;

const LifeWeeksContainer = styled.div`
  padding: 25px;
  background: #1E1E1E;
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.6);
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
`;

const BaseButton = styled.button`
  border: 1px solid #64B5F6;
  border-radius: 8px;
  padding: 10px 15px;
  color: #64B5F6;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 0.9rem;
  &:hover {
    background-color: rgba(100, 181, 246, 0.1);
  }
  &:focus {
    outline: none;
    box-shadow: 0 0 5px rgba(100, 181, 246, 0.5);
  }
`;

const TextButton = styled(BaseButton)`
  background: ${props => (props.active ? '#64B5F6' : 'transparent')};
  color: ${props => (props.active ? '#1E1E1E' : '#64B5F6')};
  &:hover {
    background-color: ${props => (props.active ? '#64B5F6' : 'rgba(100, 181, 246, 0.1)')};
  }
`;

const SizeButton = styled(BaseButton)``;

const FocusButton = styled(BaseButton)`
  margin-left: 10px;
`;

const ClockContainer = styled.div`
  text-align: center;
  font-size: 1.1rem;
  color: #90CAF9;
  padding: 20px;
  background: #1E1E1E;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
`;

const FocusModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const FocusModalContent = styled.div`
  background: #1E1E1E;
  border-radius: 16px;
  padding: 30px;
  max-width: 800px;
  width: 90%;
  color: #BBDEFB;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.8);
`;

const FocusEventCardsContainer = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
`;

const FocusEventCard = styled.div`
  background: linear-gradient(135deg, #1E1E1E, #424242);
  border-radius: 12px;
  padding: 20px;
  flex: 1 1 300px;
  color: #BBDEFB;
  box-shadow: 0 4px 10px rgba(0,0,0,0.5);
  transition: transform 0.3s ease;
  &:hover {
    transform: scale(1.02);
  }
  h3 {
    margin-top: 0;
  }
`;

// Clock Component
const Clock = ({ birthday, lifespanOption }) => {
  const [timePassedDisplay, setTimePassedDisplay] = useState('Enter birthday and lifespan');

  useEffect(() => {
    if (!birthday || !lifespanOption) return;

    const timer = setInterval(() => {
      const birthdayDate = new Date(birthday);
      const now = new Date();
      const lifespanYearsOptions = { unhealthy: 65, healthy: 80, bryan: 130 };
      const expectedLifespanYears = lifespanYearsOptions[lifespanOption];

      if (!isValid(birthdayDate) || birthdayDate >= now) {
        setTimePassedDisplay('Invalid date');
        return;
      }

      const expectedDeath = addYears(birthdayDate, expectedLifespanYears);

      if (now > expectedDeath) {
        setTimePassedDisplay('Lifespan exceeded');
        clearInterval(timer);
        return;
      }

      const yearsPassed = differenceInWeeks(now, birthdayDate) / 52;
      setTimePassedDisplay(`Years Passed: ${yearsPassed.toFixed(2)} / ${expectedLifespanYears}`);
    }, 1000);

    return () => clearInterval(timer);
  }, [birthday, lifespanOption]);

  return <ClockContainer>{timePassedDisplay}</ClockContainer>;
};

// LifeWeeksDisplay Component
const LifeWeeksDisplay = ({ birthday, setBirthday, lifespanOption, setLifespanOption }) => {
  const lifespanYears = { unhealthy: 65, healthy: 80, bryan: 130 };
  const birthdayDate = new Date(birthday);
  const now = new Date();
  const isValidDate = isValid(birthdayDate) && birthdayDate < now;

  let content;
  if (!birthday || !lifespanOption || !isValidDate) {
    content = <p style={{ color: '#90CAF9' }}>Set your birthday and lifespan to see your life weeks.</p>;
  } else {
    const expectedDeath = addYears(birthdayDate, lifespanYears[lifespanOption]);
    const totalWeeks = differenceInWeeks(expectedDeath, birthdayDate);
    const passedWeeks = differenceInWeeks(now, birthdayDate);

    const dots = Array.from({ length: totalWeeks }, (_, i) => (
      <circle
        key={i}
        cx={(i % 52) * 8 + 4}
        cy={Math.floor(i / 52) * 8 + 4}
        r={2}
        fill={i < passedWeeks ? '#424242' : 'red'}
      />
    ));

    content = (
      <svg width="100%" height={lifespanYears[lifespanOption] * 8} viewBox={`0 0 ${52 * 8} ${lifespanYears[lifespanOption] * 8}`}>
        {dots}
      </svg>
    );
  }

  return (
    <LifeWeeksContainer>
      <h2>Life Weeks</h2>
      <input
        type="date"
        value={birthday}
        onChange={e => setBirthday(e.target.value)}
        style={{
          padding: '10px',
          margin: '10px 0 15px',
          border: '1px solid #64B5F6',
          borderRadius: '8px',
          background: '#1E1E1E',
          color: '#90CAF9',
          fontSize: '1rem',
        }}
      />
      <ButtonGroup>
        {['unhealthy', 'healthy', 'bryan'].map(opt => (
          <TextButton
            key={opt}
            onClick={() => setLifespanOption(opt)}
            active={lifespanOption === opt}
          >
            {opt === 'bryan' ? 'Bryan (130)' : `${opt.charAt(0).toUpperCase() + opt.slice(1)} (${lifespanYears[opt]})`}
          </TextButton>
        ))}
      </ButtonGroup>
      <div>{content}</div>
      <p style={{ fontSize: '0.8rem', color: '#78909C', marginTop: '10px' }}>
        Darker circles represent weeks passed. Lighter circles represent future weeks.
      </p>
    </LifeWeeksContainer>
  );
};

// Main App Component
const App = () => {
  const [events, setEvents] = useState([]);
  const [birthday, setBirthday] = useState('');
  const [lifespanOption, setLifespanOption] = useState('healthy');
  const [calendarHeight, setCalendarHeight] = useState(600);
  const [isFocusMode, setIsFocusMode] = useState(false);

  const parseEvents = (input) => {
    if (!input.trim()) return;

    const eventStrings = input.split(';').map(str => str.trim());
    let newEvents = [];
    let idCounter = Date.now();
    const chunkSize = 500;

    const processChunk = (startIndex) => {
      const endIndex = Math.min(startIndex + chunkSize, eventStrings.length);

      for (let i = startIndex; i < endIndex; i++) {
        const str = eventStrings[i];
        const match = str.match(/^(?:\[([^\]]+)\]\s*)?(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})$/i);

        if (match) {
          const [, title, startTime, endTime] = match;
          const today = new Date();
          const start = parse(startTime, 'HH:mm', today);
          const end = parse(endTime, 'HH:mm', today);

          if (isValid(start) && isValid(end)) {
            newEvents.push({
              id: `event-${idCounter++}`,
              title: title ? title.trim() : 'Untitled',
              start,
              end,
              color: '#64B5F6',
            });
          }
        } else if (str.trim()) {
          console.warn(`Invalid event format: "${str}"`);
        }
      }

      if (endIndex < eventStrings.length) {
        requestAnimationFrame(() => processChunk(endIndex));
      } else {
        setEvents(prev => [...prev, ...newEvents]);
      }
    };

    requestAnimationFrame(() => processChunk(0));
  };

  const toggleFocusMode = () => {
    setIsFocusMode(prev => !prev);
  };

  const exitFocusMode = () => {
    setIsFocusMode(false);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      exitFocusMode();
    }
  };

  const activeFocusEvents = events.filter(
    event => event.title !== "Welcome Event" && event.start <= new Date() && new Date() < event.end
  );

  return (
    <AppContainer>
      <GlobalStyle />
      <Header>
        Fast Calendar (24hr Format)
        <FocusButton onClick={toggleFocusMode}>
          {isFocusMode ? 'Exit Focus Mode' : 'Enter Focus Mode'}
        </FocusButton>
      </Header>
      <Input
        placeholder="e.g., [Meeting] 14:00-15:30; [Call] 16:00-17:00"
        onKeyDown={e => {
          if (e.key === 'Enter') {
            parseEvents(e.target.value);
            e.target.value = '';
          }
        }}
      />
      <MainContent>
        <CalendarWrapper>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px', gap: '10px' }}>
            <SizeButton onClick={() => setCalendarHeight(prev => prev + 10000)}>
              Increase Size
            </SizeButton>
            <SizeButton onClick={() => setCalendarHeight(prev => Math.max(prev - 1000, 400))}>
              Decrease Size
            </SizeButton>
          </div>
          <Calendar
            localizer={localizer}
            events={events}
            view="day"
            step={1}
            timeslots={60}
            defaultView="day"
            min={new Date(new Date().setHours(0, 0, 0, 0))}
            max={new Date(new Date().setHours(23, 59, 59, 999))}
            style={{ height: `${calendarHeight}px`, background: '#1E1E1E', color: '#64B5F6', borderRadius: '8px' }}
            formats={{
              timeGutterFormat: 'HH:mm',
              eventTimeRangeFormat: ({ start, end }) => `${format(start, 'HH:mm')} - ${format(end, 'HH:mm')}`,
            }}
          />
        </CalendarWrapper>
        <RightSection>
          <Clock birthday={birthday} lifespanOption={lifespanOption} />
          <LifeWeeksDisplay
            birthday={birthday}
            setBirthday={setBirthday}
            lifespanOption={lifespanOption}
            setLifespanOption={setLifespanOption}
          />
        </RightSection>
      </MainContent>
      {isFocusMode && (
        <FocusModalOverlay onClick={handleOverlayClick}>
          <FocusModalContent onClick={e => e.stopPropagation()}>
            <h2 style={{ textAlign: 'center' }}>Focus Mode</h2>
            <FocusEventCardsContainer>
              {activeFocusEvents.length > 0 ? (
                activeFocusEvents.map(event => (
                  <FocusEventCard key={event.id}>
                    <h3>{event.title}</h3>
                    <p>{format(event.start, 'HH:mm')} - {format(event.end, 'HH:mm')}</p>
                    <p>This is your focused task. Stay on track!</p>
                  </FocusEventCard>
                ))
              ) : (
                <p>No active events currently. Add some events to focus on!</p>
              )}
            </FocusEventCardsContainer>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <BaseButton onClick={exitFocusMode}>Close Focus Mode</BaseButton>
            </div>
          </FocusModalContent>
        </FocusModalOverlay>
      )}
    </AppContainer>
  );
};

export default App;