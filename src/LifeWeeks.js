// Components logic (LifeWeeksDisplay)
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

  export default LifeWeeksDisplay;