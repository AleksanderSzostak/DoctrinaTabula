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
import Edycja from "./Edycja";
import './App.css'

function Home() {
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem("loggedIn"));
  const [word, setWord] = useState("apple");
  const navigate = useNavigate();

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
                localStorage.setItem("fiszki", JSON.stringify(data));
                console.log(data);
                document.getElementById("explorer").innerText = "";
                for(const i of data){
                  document.getElementById("explorer").innerHTML += i.nazwa+"<br>";
                }
              });
          } 
          else if (res.status === 401) {
            localStorage.clear();
            setLoggedIn("false");/* <-- Zakladajac ze funkcja jest w Home() (to odswiezy UI)*/
            navigate("/login"); 
            /*WAZNE: 
            Zeby to dzialalo trzeba zaimportowac: import { useNavigate } from "react-router-dom";
            I na poczatku funkcji tam gdzie useCount i useEffect sie daje dac: const navigate = useNavigate();*/
          }
        });
      }
      else if (status === 200) {
        localStorage.setItem("fiszki", JSON.stringify(data));
        console.log(data);
        document.getElementById("explorer").innerText = "";
        for(const i of data){
          document.getElementById("explorer").innerHTML += i.nazwa+"<br>";
        }
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

    localStorage.clear();
    setLoggedIn("false");
  }

  const increment = () => {
    const element = document.getElementById('flashcard');

    element.classList.remove('flip');
    void element.offsetWidth;
    element.classList.add('flip');
    
    Promise.all(
    element.getAnimations({ subtree: true }).map((animation) => animation.finished),
    ).then(() => setWord("jablko"));
    
  };

  return (
    <>
      <div id="header" className="h-2/25 w-full flex flex-row flex-auto">
        <div id="menu" className="bg-[#2b0f54] h-full basis-1/2 flex flex-auto">
          <div className="text-4xl text-white justify-center content-center ml-[2%]">Fiszki</div>
        </div>
        <Link to={loggedIn == "true" ? "/edytuj" : "/login"} className="basis-1/10">
          <div id="editMenu" className="bg-[#ff4f69] hover:bg-[#ff8093] h-full flex justify-center items-center">
            <div className="text-3xl text-white justify-center">Test</div>
          </div>
        </Link>
        <div id="userMenu" className="bg-[#ff4f69] hover:bg-[#ff8093] h-full basis-1/10 flex justify-center items-center">
          {loggedIn == "true" ?
            <button onClick={wyloguj} className="text-3xl text-white justify-center ml-[2%] cursor-pointer w-full h-full">Wyloguj się</button>
          : 
            <Link to="/login" className="text-3xl text-white w-full h-full flex justify-center items-center">Zaloguj się</Link>
          }
          
        </div>
      </div>
      
      <div id="flexBlock" className="flex flex-row h-23/25 w-full">
        <div id="sidebar" className="h-full w-1/4 flex flex-col flex-auto">
            <div id="titleBar" className="bg-[#ff4f69] basis-1/10 w-full flex justify-center content-center">
              <div className="text-3xl text-white justify-center content-center" >Pliki</div>
            </div>
          <div id="explorer" className="bg-[#ab1f65] basis-9/10 w-full flex flex-auto">

          </div>
      </div>
      <div id="main" className="h-full w-3/4 flex flex-col flex-auto">
        <div id="fish" className="bg-black h-full basis-3/4 flex flex-auto flex-wrap justify-center content-center">
          <div id="flashcard" className="bg-[#49e7ec] h-3/5 w-3/5 flex flex-wrap rounded-4xl justify-center content-center click:rotate-x-180" onClick={increment}>{word}</div>
        </div>
        <div id="footer" className="bg-[#2b0f54] basis-2/25 w-full flex flex-row justify-center content-center">
          <div className="text-xl text-white justify-center content-center">Stopka</div>
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
            <Route path="/edytuj" element={<Edycja />} />
        </Routes>
    </BrowserRouter>
  );
}


export default App;
