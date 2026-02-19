/*
Instrukcja do requestow:
Mamy jakis
let status;
fetch("bla bla bla", {
  credentials: "include"}) <--- WAZNE
  .then(res => {
      status = res.status;
      return res.json();
  })
  .then(data => {
      if (status === 401) {
          fetch("http://localhost:8080/refresh", {
            method: "POST",
            credentials: "include"
          })
          .then(res => {
            if (res.status === 200) {
              Robimy tego samego fetch co wczesniej tylko tym razem nie musimy wysylac drugiego fetcha do "/refresh" jesli jest blad
            } else if (res.status === 401) {
              localStorage.setItem("loggedIn", "false");
              setLoggedIn("false"); <-- Zakladajac ze funkcja jest w Home() (to odswiezy UI)
              navigate("/login"); 
              WAZNE: 
              Zeby to dzialalo trzeba zaimportowac: import { useNavigate } from "react-router-dom";
              I na poczatku funkcji tam gdzie useCount i useEffect sie daje dac: const navigate = useNavigate();
            }
          });
      } else if (status === 200) {
          To co sie dzieje jak sie uda
      }
  })
  .catch(err => {
      console.error("Fetch error:", err);
  });
*/
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import './App.css'

function Home() {
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem("loggedIn"));
  const [word, setWord] = useState("Kliknij, żeby zacząć!");
  const navigate = useNavigate();
  const [flipped, setFlipped] = useState(false);
  var [currentGroup, setGroup] = useState(0);
  var [currentFiszka, setFiszka] = useState(1);
  const [fiszki,setFiszki] = useState(null);
  const [isCorrectHovered, setIsCorrectHovered] = useState(false);
  const [isWrongHovered,   setIsWrongHovered]   = useState(false);
  const [loading, setLoading] = useState(true);
  const [remainingFiszki, setRemainingFiszki] = useState(null);
  let status;
  useEffect(() => {fetch("http://localhost:8080/zestawy", {
    credentials: "include"})
    .then(res => {
      status = res.status;
      return res.json();
    })
    .then(data => {
      if (status === 401) {
        console.log("Refreshing token")
        fetch("http://localhost:8080/refresh", {
          method: "POST",
          credentials: "include"
        })
        .then(res => {
          if (res.status === 200) {
            fetch("http://localhost:8080/zestawy", {
              credentials: "include"})
              .then(res => {
                status = res.status;
                return res.json();
              })
              .then(data => {
                console.log(data);
                setFiszki(data);
                setLoading(false);
              });
          } 
          else if (res.status === 401) {
            localStorage.setItem("loggedIn", "false");
            setLoggedIn("false");/* <-- Zakladajac ze funkcja jest w Home() (to odswiezy UI)*/
            navigate("/login"); 
            /*WAZNE: 
            Zeby to dzialalo trzeba zaimportowac: import { useNavigate } from "react-router-dom";
            I na poczatku funkcji tam gdzie useCount i useEffect sie daje dac: const navigate = useNavigate();*/
          }
        });
      }
      else if (status === 200) {
        console.log(data);
        setFiszki(data);
        setGroup(0);
        setLoading(false);
      }
    })
  .catch(err => {
    console.error("Fetch error:", err);
  })}, []);
  

  async function wyloguj() {
    await fetch("http://localhost:8080/logout", {
      method: "POST",
      credentials: "include"
    });

    localStorage.setItem("loggedIn", "false");
    setLoggedIn("false");
  }

  const flip = () => {
    const element = document.getElementById('flashcard');
    if (element) {
      element.classList.remove('flip');
      void element.offsetWidth;
      element.classList.add('flip');
    }
  }

  const increment = () => {
    if (!fiszki || !fiszki[currentGroup] || !fiszki[currentGroup].fiszki) {
      console.log("No data yet — cannot flip");
      return;
    }
    flip();
    if (!flipped) {
      setWord(fiszki[currentGroup].fiszki[currentFiszka].slowo || "Brak słowa");
    } else {
      const def = fiszki[currentGroup].fiszki[currentFiszka];
      setWord(
        `Definicja: ${def.definicja || "??"}` +
        `\n\nPrzykładowe zdanie: ${def.zdanie || "-"}`
      );
    }
    setFlipped(!flipped);
  };

  const nextFiszka = (knew) =>{
  if (!fiszki || !fiszki[currentGroup] || !fiszki[currentGroup].fiszki) {
      console.log("Cannot go next — data not ready");
      return;
    }

    const cards = fiszki[currentGroup].fiszki;
    console.log(currentFiszka)
    const currentIdx = currentFiszka - 1;
    if (currentIdx + 2 < cards.length) {
      setFiszka(currentFiszka + 1);
      flip();
      setFlipped(true);
      setWord(fiszki[currentGroup].fiszki[currentFiszka+1].slowo);
    } else {
      alert("koniec fiszek w tej grupie");
    }
  };

  const changeGroup = (index) => {
  if (!fiszki || !fiszki[index]) return;

  setGroup(index);
  setFiszka(0);
  setFlipped(false);

  const firstCard = fiszki[index].fiszki?.[0];
  if (firstCard) {
    setWord(firstCard.slowo || "Brak słowa");
  } else {
    setWord("Brak fiszek w tej grupie");
  }
};


  return (
    <>
      <div id="header" class="h-2/25 w-full flex flex-row flex-auto">
        <div id="menu" class="bg-[#2b0f54] h-full basis-1/2 flex flex-auto">
          <div class="text-4xl text-white justify-center content-center ml-[2%]">Fiszki</div>
        </div>
        <div id="userMenu" class="bg-[#ff4f69] h-full basis-1/10 flex justify-center content-center">
          {loggedIn == "true" ?
            <button onClick={wyloguj} className="text-3xl text-white justify-center content-center ml-[2%] cursor-pointer">Wyloguj się</button>
          : 
            <Link to="/login"><div class="text-3xl text-white justify-center content-center">Zaloguj się</div></Link>
          }
          
        </div>
      </div>
      
      <div id="flexBlock" class="flex flex-row h-23/25 w-full">
        <div id="sidebar" class="h-full w-1/4 flex flex-col flex-auto">
            <div id="titleBar" class="bg-[#ff4f69] basis-1/10 w-full flex justify-center content-center">
              <div class="text-3xl text-white justify-center content-center" >Grupy</div>
            </div>
          <div id="explorer" class="bg-[#ab1f65] basis-9/10 w-full flex flex-auto">
            {fiszki && fiszki.map((group, index) => (
              <div key={group.id}>
                <button onClick={() => changeGroup(index)}>
                  {group.nazwa}
                </button>
                <br />
              </div>
            ))}
          </div>
      </div>
      <div id="main" class="h-full w-3/4 flex flex-col flex-auto ">


      <div id="wrong"
      onMouseEnter={() => setIsWrongHovered(true)}
        onMouseLeave={() => setIsWrongHovered(false)}
        style={{
          height: '100%',
          padding: '20px 40px',
          borderTopRightRadius: '8px',
          borderBottomRightRadius: '8px',
          backgroundColor: isWrongHovered 
            ? 'rgba(255, 0, 0, 0.5)'     // semi-transparent red
            : 'rgba(255, 0, 0, 0.0)',
          
          cursor: 'pointer',
          transition: 'background-color 0.25s ease',
          minWidth: '180px',
          textAlign: 'center',
        }}class="h-64 bg-gray-100 flex items-center justify-center"
        onClick={() => nextFiszka(false)}
       >
          <h1           style={{
            color: isWrongHovered
            ? 'black'
            : 'rgba(0, 0, 0, 0.0)',
          }} class="text-4xl font-bold text-black">Nie umiem</h1>
        </div>
      <div id="correct" onMouseEnter={() => setIsCorrectHovered(true)}
        onMouseLeave={() => setIsCorrectHovered(false)}
        style={{
          height: '100%',
          padding: '20px 40px',
          borderTopLeftRadius: '8px',
          borderBottomLeftRadius: '8px',
          backgroundColor: isCorrectHovered 
            ? 'rgba(0, 255, 0, 0.5)' 
            : 'rgba(0, 255, 0, 0.0)',
          cursor: 'pointer',
          transition: 'background-color 0.25s ease',
          minWidth: '180px',
          textAlign: 'center',
        }}
        class="h-64 bg-gray-100 flex items-center justify-center"
        onClick={() => nextFiszka(true)}
        >
          <h1 class="text-4xl font-bold text-black"
          style={{
            color: isCorrectHovered
            ? 'black'
            : 'rgba(0, 0, 0, 0.0)',
          }}
          >Umiem</h1>
        </div>


        <div id="fish" class="bg-black h-full basis-3/4 flex flex-auto flex-wrap justify-center content-center">
          <div id="flashcard" class="p-10 font-semibold text-4xl bg-[#49e7ec] h-3/5 w-3/5 flex flex-wrap rounded-4xl justify-center content-center click:rotate-x-180" onClick={increment}>{word}</div>
        </div>
      </div>
    </div>
    
    
    </>
  );
}


function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
        </Routes>
    </BrowserRouter>
  );
}


export default App;
