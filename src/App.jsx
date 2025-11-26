import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div id="header" class="h-2/25 w-full flex flex-row flex-auto">
      <div id="menu" class="bg-blue-500 h-full basis-1/2 flex flex-auto">

      </div>
      <div id="userMenu" class="bg-green-500 h-full basis-1/10 flex">

      </div>
    </div>
    
    <div id="flexBlock" class="flex flex-row h-23/25 w-full">
      <div id="sidebar" class="h-full w-1/4 flex flex-col flex-auto">
          <div id="titleBar" class="bg-yellow-500 basis-1/10 w-full flex">

          </div>
          <div id="explorer" class="bg-pink-500 basis-9/10 w-full flex flex-auto">

          </div>
      </div>
      <div id="main" class="h-full w-3/4 flex flex-col flex-auto">
        <div id="fish" class="bg-purple-500 h-full basis-3/4 flex flex-auto flex-wrap justify-center content-center">
          <div id="flashcard" class="bg-blue-300 h-3/5 w-3/5 flex flex-wrap rounded-4xl justify-center content-center hover:rotate-x-180">Tekst</div>
        </div>
        <div id="footer" class="bg-black basis-2/25 w-full flex flex-row">

        </div>
      </div>
    </div>
    
    
    </>
  )
}

export default App
