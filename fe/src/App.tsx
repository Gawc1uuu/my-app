import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Hello world</h1>
      <p>{count}</p>
      <button onClick={() => setCount(prev => prev - 1)}>-</button>
      <button onClick={() => setCount(prev => prev + 1)}>+</button>
    </>
  )
}

export default App
