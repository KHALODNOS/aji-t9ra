import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import VocalRoom from './common/VoiceRoom'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <VocalRoom />
    </>
  )
}

export default App
