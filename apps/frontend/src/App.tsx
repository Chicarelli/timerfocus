import { useEffect, useRef, useState } from 'react'
import './App.css'
import { Timer } from './components/Timer/Timer'
import { createNewCycle, getCycleConfig, registerNewEvent } from './services/Cycle';

function App() {
  const [timer, setTimer] = useState<number>(25 * 60);
  const [shortIntervalCount, setShortIntervalCount] = useState<number>(0);
  const [status, setStatus] = useState<'idle' | 'running' | 'paused'>('idle');
  const [cycle, setCycle] = useState<'work' | 'thoughfulWork' | 'shortBreak' | 'longBreak'>('work');
  const [cycleId, setCycleId] = useState<string | null>(null);
  const lastHeartbeatSentAt = useRef<number>(0);

  const [cycleConfig, setCycleConfig] = useState({
    longBreakTime: 15,
    mode: "default",
    shortBreakTime: 5,
    shortIntervalCount: 4,
    thoughfulWorkTime: 25,
    userId: "23a53c1e-5599-427b-850a-8bc960d17f32",
    workTime: 25
  });

  useEffect(() => {
    const fetchCycleConfig = async () => {
      // Fetch cycle config for user
      const data = await getCycleConfig(localStorage.getItem('userId') as string);
      setCycleConfig(data);
      setTimer(data.workTime * 60);
    }

    fetchCycleConfig();
  }, []);

  useEffect(() => {
    const elapsedSinceLastHeartbeat = Date.now() - lastHeartbeatSentAt.current;
    if ((cycle === 'thoughfulWork' || cycle === 'work') && status === 'running' && elapsedSinceLastHeartbeat >= 5000 && cycleId) {
      lastHeartbeatSentAt.current = Date.now();
      registerNewEvent(localStorage.getItem('userId') as string, cycleId, 'heartbeat')
      .then(result => {
        console.log('registered new heartbeat', result);
      })
    }

  }, [status, timer, cycle, cycleId, cycleConfig])

  useEffect(() => {
    let interval = null;

    interval = setInterval(() => {
      if (status === "running") {
        setTimer((prev) => {
          if (prev > 0) {
            return prev - 1
          }
          return 0;
        })
      }
    }, 1000);

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [status]);

  async function startTimer() {
    if ((cycle === 'work' || cycle === 'thoughfulWork') && status === 'idle') {      
      const result = await createNewCycle(localStorage.getItem('userId') as string, cycle === 'work' ? 'default' : 'learning');
      console.log('newCycle');
      console.log(result);
      setCycleId(result.id);
      lastHeartbeatSentAt.current = Date.now();
    }

    if ((cycle === 'work' || cycle === 'thoughfulWork') && status === 'paused' && cycleId) {
      const result = await registerNewEvent(localStorage.getItem('userId') as string, cycleId, 'unpause');
      console.log('unpause')
      console.log(result);
      lastHeartbeatSentAt.current = Date.now();
    }
    setStatus("running");
  }

  async function pauseTimer() {
     if ((cycle === 'work' || cycle === 'thoughfulWork') && cycleId) {
      
      console.log('Request to end cycle');
      const result = await registerNewEvent(localStorage.getItem('userId') as string, cycleId, 'pause');
      console.log(result);
    }
    setStatus("paused");
  }

  function nextCycle() {
    if ((cycle === 'work' && cycleConfig.mode === 'default') || cycle === 'thoughfulWork') { //if actual is work cycle, then should see if the next is thoughful work or short break
      const isShortBreak = shortIntervalCount < cycleConfig.shortIntervalCount;

      setCycle(isShortBreak ? 'shortBreak' : 'longBreak');
      setShortIntervalCount((prev) => {
        return isShortBreak ? prev + 1 : 0;
      });
      setTimer(isShortBreak ? cycleConfig.shortBreakTime * 60 : cycleConfig.longBreakTime * 60);
      setStatus('idle');
      return;
    }

    if (cycle === 'work' && cycleConfig.mode === 'thoughfulWork') {
      setCycle('thoughfulWork');
      setTimer(cycleConfig.thoughfulWorkTime * 60);
      setStatus('idle');
      return;
    }

    if (cycle === 'shortBreak' || cycle === 'longBreak') {
      setCycle('work');
      setTimer(cycleConfig.workTime * 60);
      setStatus('idle');
    }
  }

  async function endTimer() {
    if ((cycle === 'work' || cycle === 'thoughfulWork') && cycleId) {
      
      console.log('Request to end cycle');

      await registerNewEvent(localStorage.getItem('userId') as string, cycleId, 'end');
      setCycleId(null);
    }
    nextCycle();
  }

  return (
    <>
      <Timer timer={timer} />
      <div>
        <button onClick={startTimer}>
          Start timer
        </button>
        <button onClick={pauseTimer}>
          Pause timer
        </button>
        <button onClick={endTimer}>
          End timer
        </button>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
