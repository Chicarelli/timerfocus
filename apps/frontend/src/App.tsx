import { use, useEffect, useState } from 'react'
import './App.css'
import { Timer } from './components/Timer/Timer'
import { getCycleConfig } from './services/Cycle';

function App() {
  const [timer, setTimer] = useState<number>(25 * 60);
  const [status, setStatus] = useState<'idle' | 'running' | 'paused'>('idle');
  const [cycle, setCycle] = useState<'work' | 'thoughfulWork' | 'shortBreak' | 'longBreak'>('work');
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
    }

    fetchCycleConfig();

  }, []);

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

  function startTimer() {
    setStatus("running");
  }

  function pauseTimer() {
    setStatus("paused");
  }

  function endTimer() {
    setStatus('idle');
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
