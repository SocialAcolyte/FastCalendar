// Main Calendar App Component
  // The good stuff
    // Using states to manage the calendar view, date, events, dark mode, locked in, parse errors, last input, last repeat date, calendar height, birthday, lifespan option, selected event, and editing event
    const MainApp = () => {
        const [calendarView, setCalendarView] = useState('day');
        const [calendarDate, setCalendarDate] = useState(new Date());
        const [events, setEvents] = useState([]);
        const [darkMode, setDarkMode] = useState(false);
        const [lockedIn, setLockedIn] = useState(false);
        const [parseErrors, setParseErrors] = useState([]);
        const [lastInput, setLastInput] = useState('');
        const [lastRepeatDate, setLastRepeatDate] = useState(null);
        const [calendarHeight, setCalendarHeight] = useState(800);
        const [birthday, setBirthday] = useState('');
        const [lifespanOption, setLifespanOption] = useState(null);
        const [selectedEvent, setSelectedEvent] = useState(null);
        const [editingEvent, setEditingEvent] = useState(null);
        const calendarWrapperRef = useRef(null);
      
        const parseEvents = (input, referenceDate) => {
          if (!input.trim()) return;
          const eventStrings = input.split(';').map(str => str.trim());
          const newEvents = [];
          const errors = [];
          eventStrings.forEach(str => {
            const match = str.match(/^\[?(.*?)\]?\s*(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})\s*(am|pm)?$/i);
            if (match) {
              const [, title, startTime, endTime, period] = match;
              let start, end;
              if (period) {
                start = parse(`${startTime} ${period}`, 'h:mm a', referenceDate);
                end = parse(`${endTime} ${period}`, 'h:mm a', referenceDate);
              } else {
                start = parse(startTime, 'H:mm', referenceDate);
                end = parse(endTime, 'H:mm', referenceDate);
              }
              if (isValid(start) && isValid(end)) {
                if (end < start) end.setDate(end.getDate() + 1);
                newEvents.push({ title: title.trim() || 'Untitled', start, end, color: '#3788d8' });
              } else {
                errors.push(`Invalid time format: ${str}`);
              }
            } else {
              errors.push(`Invalid event format: ${str}`);
            }
          });
          setEvents(prev => [...prev, ...newEvents]);
          setParseErrors(errors);
          if (newEvents.length > 0) setLastRepeatDate(referenceDate);
        };
      
        const repeatEvents = () => {
          if (lastInput) {
            const nextDay = lastRepeatDate ? addDays(lastRepeatDate, 1) : addDays(new Date(), 1);
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
      
        const CustomEvent = ({ event }) => (
          <div style={{ backgroundColor: event.color, color: 'white', padding: '5px', borderRadius: '5px' }}>
            {event.title}
          </div>
        );
      
        const handleSelectEvent = (event) => {
          setSelectedEvent(event);
          setEditingEvent({ ...event, start: new Date(event.start), end: new Date(event.end) });
        };
      
        return (
          <AppContainer dark={darkMode} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
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
                placeholder="e.g., PLACEHOLDER"
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
                  onView={setCalendarView}
                  date={calendarDate}
                  onNavigate={setCalendarDate}
                  step={15}
                  timeslots={4}
                  views={['day', 'week', 'month']}
                  style={{ height: `${calendarHeight}px` }}
                  onSelectEvent={handleSelectEvent}
                  components={{ event: CustomEvent }}
                />
                {selectedEvent && editingEvent && (
                  <ModalOverlay
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setSelectedEvent(null)}
                  >
                    <ModalContent dark={darkMode} onClick={e => e.stopPropagation()}>
                      <FormLabel dark={darkMode}>
                        Title:
                        <FormInput
                          type="text"
                          value={editingEvent.title}
                          onChange={e => setEditingEvent({ ...editingEvent, title: e.target.value })}
                        />
                      </FormLabel>
                      <FormLabel dark={darkMode}>
                        Start:
                        <FormInput
                          type="time"
                          value={format(editingEvent.start, 'HH:mm')}
                          onChange={e => {
                            const [hours, minutes] = e.target.value.split(':');
                            const newStart = new Date(editingEvent.start);
                            newStart.setHours(parseInt(hours), parseInt(minutes));
                            setEditingEvent({ ...editingEvent, start: newStart });
                          }}
                        />
                      </FormLabel>
                      <FormLabel dark={darkMode}>
                        End:
                        <FormInput
                          type="time"
                          value={format(editingEvent.end, 'HH:mm')}
                          onChange={e => {
                            const [hours, minutes] = e.target.value.split(':');
                            const newEnd = new Date(editingEvent.end);
                            newEnd.setHours(parseInt(hours), parseInt(minutes));
                            setEditingEvent({ ...editingEvent, end: newEnd });
                          }}
                        />
                      </FormLabel>
                      <FormLabel dark={darkMode}>
                        Color:
                        <FormInput
                          type="color"
                          value={editingEvent.color}
                          onChange={e => setEditingEvent({ ...editingEvent, color: e.target.value })}
                        />
                      </FormLabel>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                        <TextButton
                          dark={darkMode}
                          onClick={() => {
                            const text = `Title: ${editingEvent.title}\nStart: ${format(editingEvent.start, 'PPpp')}\nEnd: ${format(editingEvent.end, 'PPpp')}`;
                            navigator.clipboard.writeText(text).then(() => alert('Event details copied to clipboard'));
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Share
                        </TextButton>
                        <TextButton
                          dark={darkMode}
                          onClick={() => {
                            setEvents(prev => prev.map(ev => ev === selectedEvent ? editingEvent : ev));
                            setSelectedEvent(null);
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Save
                        </TextButton>
                        <TextButton
                          dark={darkMode}
                          onClick={() => {
                            setEvents(prev => prev.filter(ev => ev !== selectedEvent));
                            setSelectedEvent(null);
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Delete
                        </TextButton>
                        <TextButton
                          dark={darkMode}
                          onClick={() => setSelectedEvent(null)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Close
                        </TextButton>
                      </div>
                    </ModalContent>
                  </ModalOverlay>
                )}
              </CalendarWrapper>
              <RightSection>
                <Clock dark={darkMode} birthday={birthday} lifespanOption={lifespanOption} />
                <LifeWeeksDisplay
                  dark={darkMode}
                  birthday={birthday}
                  setBirthday={setBirthday}
                  lifespanOption={lifespanOption}
                  setLifespanOption={setLifespanOption}
                />
              </RightSection>
            </MainContent>
          </AppContainer>
        );
      };

      export default MainApp;