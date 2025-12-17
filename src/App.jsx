import { useState } from 'react'
import './App.css'

function App() {
  const increment = () => {
    const element = document.getElementById('flashcard');

    element.classList.remove('flip');
    void element.offsetWidth;
    element.classList.add('flip');
    
    Promise.all(
    element.getAnimations({ subtree: true }).map((animation) => animation.finished),
    ).then(() => setCount(count + 1));
    
  };

  return (
    <>
    <div id="header" class="h-2/25 w-full flex flex-row flex-auto">
      <div id="menu" class="bg-[#2b0f54] h-full basis-1/2 flex flex-auto">
        <div class="text-4xl text-white justify-center content-center ml-[2%]">Fiszki</div>
      </div>
      <div id="userMenu" class="bg-[#ff4f69] h-full basis-1/10 flex justify-center content-center">
        <div class="text-3xl text-white justify-center content-center">Zaloguj się</div>
      </div>
    </div>
    
    <div id="flexBlock" class="flex flex-row h-23/25 w-full">
      <div id="sidebar" class="h-full w-1/4 flex flex-col flex-auto">
          <div id="titleBar" class="bg-[#ff4f69] basis-1/10 w-full flex justify-center content-center">
            <div class="text-3xl text-white justify-center content-center">Pliki</div>
          </div>
          <div id="explorer" class="bg-[#ab1f65] basis-9/10 w-full flex flex-auto">

          </div>
      </div>
      <div id="main" class="h-full w-3/4 flex flex-col flex-auto">
        <div id="fish" class="bg-black h-full basis-3/4 flex flex-auto flex-wrap justify-center content-center">
          <div id="flashcard" class="bg-[#49e7ec] h-3/5 w-3/5 flex flex-wrap rounded-4xl justify-center content-center click:rotate-x-180" onClick={increment}>{count}</div>
        </div>
        <div id="footer" class="bg-[#2b0f54] basis-2/25 w-full flex flex-row justify-center content-center">
          <div class="text-xl text-white justify-center content-center">Stopka</div>
        </div>
      </div>
    </div>
    
    
    </>
  );
}

export default App;
