import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import axios from 'axios'
// import './App.css'

axios.defaults.baseURL = "http://localhost:8000"

function App() {
  useEffect(() => {
    async function fetch() {
      const response = await axios.post("/hello", { name: "vlad" });
      console.log("response" , response.data);

  }
    fetch()
  },  [])


  return (
    <span>hello wolrd !</span>
  )
}

export default App
