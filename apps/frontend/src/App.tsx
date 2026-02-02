import { useEffect, useState } from 'react'
import './App.css'
import { Timer } from './components/Timer/Timer'

function App() {
  const [timer, setTimer] = useState<number>(25 * 60);
  const [status, setStatus] = useState<'idle' | 'running' | 'paused'>('idle');

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
