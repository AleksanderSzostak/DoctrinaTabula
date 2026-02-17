import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from "react";

const fiszkiDoZmiany = {dodaneGrupy: [], zmienioneGrupy: [], usunieteGrupy: [], dodaneFiszki: [], zmienioneFiszki: [], usunieteFiszki: []};
let increment = 1;


export default function Edycja() {
    const [fiszki, setFiszki] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("loggedIn") !== "true") {
            navigate("/login");
        }

        function checkIfLoaded() {
            if (localStorage.getItem("fiszki")) {
                setFiszki(JSON.parse(localStorage.getItem("fiszki")));
                setLoading(false);
                return true;
            }

            return false;
        }

        if (checkIfLoaded()) {
            return;
        }

        const interval = setInterval(() => {
            if (checkIfLoaded()) {
              clearInterval(interval);
            }
        }, 200);

        return () => clearInterval(interval);
    }, []);

    async function wyloguj() {
        await fetch("http://localhost:8080/logout", {
            method: "POST",
            credentials: "include"
        });

        localStorage.clear();
        navigate("/");
    }

    if (loading) {
        return "Loading";
    }

    return (
        <>
            <div id="header" className="h-2/25 w-full flex flex-row flex-auto">
                <div id="menu" className="bg-[#2b0f54] h-full basis-1/2 flex flex-auto">
                <div className="text-4xl text-white justify-center content-center ml-[2%]">Fiszki</div>
                </div>
                <Link to="/" className="basis-1/10">
                <div id="editMenu" className="bg-[#ff4f69] hover:bg-[#ff8093] h-full flex justify-center items-center">
                    <div className="text-3xl text-white justify-center">Wróć</div>
                </div>
                </Link>
                <div id="userMenu" className="bg-[#ff4f69] hover:bg-[#ff8093] h-full basis-1/10 flex justify-center items-center">
                    <button onClick={wyloguj} className="text-3xl text-white justify-center ml-[2%] cursor-pointer w-full h-full">Wyloguj się</button>
                </div>
            </div>
            <div id="main" className="h-23/25 w-full flex flex-col flex-auto">
            <div id="fish" className="bg-black h-full text-white flex flex-col p-6">
                <h1 className="text-3xl mb-6">Twoje grupy:</h1>

                <div className="overflow-y-auto space-y-4 pr-2">
                    {fiszki.map((fiszka) => (
                    <Grupa key={fiszka.id} idGrupy={fiszka.id} nazwa={fiszka.nazwa} fiszki={fiszka.fiszki} />
                    ))}
                </div>

                <div className="mt-6 flex gap-4">
                    <button className="bg-[#ff4f69] hover:bg-[#ff8093] px-6 py-2 rounded-xl transition">
                    Dodaj nową
                    </button>
                    <button className="bg-[#2b0f54] hover:bg-[#533e70] px-6 py-2 rounded-xl transition">
                    Zapisz
                    </button>
                </div>
                </div>
            </div>
        </>
      );
}

function Grupa({ idGrupy, nazwa, fiszki }) {
    const [open, setOpen] = useState(false);
    const [localFiszki, setLocalFiszki] = useState(fiszki);

    function handleChange(index, field, value, idFiszki, tempIdFiszki) {
        const updated = [...localFiszki];
        updated[index][field] = value;

        if (tempIdFiszki) {
            let indexFiszki = fiszkiDoZmiany.dodaneFiszki.findIndex((fiszka) => tempIdFiszki == fiszka.tempId);
            if (indexFiszki !== -1) {
                fiszkiDoZmiany.dodaneFiszki.splice(indexFiszki, 1, {tempId: tempIdFiszki, slowo: updated[index]["slowo"], definicja: updated[index]["definicja"], zdanie: updated[index]["zdanie"]});
            } else {
                fiszkiDoZmiany.dodaneFiszki.push({tempId: tempIdFiszki, slowo: updated[index]["slowo"], definicja: updated[index]["definicja"], zdanie: updated[index]["zdanie"]});
            } 
        } else {
            let indexFiszki = fiszkiDoZmiany.zmienioneFiszki.findIndex((fiszka) => idFiszki == fiszka.id);
            if (indexFiszki !== -1) {
                fiszkiDoZmiany.zmienioneFiszki.splice(indexFiszki, 1, {id: idFiszki, slowo: updated[index]["slowo"], definicja: updated[index]["definicja"], zdanie: updated[index]["zdanie"]});
            } else {
                fiszkiDoZmiany.zmienioneFiszki.push({id: idFiszki, slowo: updated[index]["slowo"], definicja: updated[index]["definicja"], zdanie: updated[index]["zdanie"]});
            }
        }
        
        console.log(fiszkiDoZmiany)
        setLocalFiszki(updated);
    }

    function dodajFiszke() {
        setLocalFiszki([...localFiszki, {groupId: idGrupy, slowo: "", definicja: "", zdanie: "", tempId: increment++}]);
    }

    function usunFiszke(idFiszki, tempIdFiszki) {
        if (idFiszki) {
            let index = fiszkiDoZmiany.zmienioneFiszki.findIndex((fiszka) => fiszka.id == idFiszki);
            fiszkiDoZmiany.zmienioneFiszki.splice(index);
            fiszkiDoZmiany.usunieteFiszki.push({id: idFiszki});
        } else {
            let index = fiszkiDoZmiany.dodaneFiszki.findIndex((fiszka) => fiszka.tempId == tempIdFiszki);
            fiszkiDoZmiany.dodaneFiszki.splice(index);
        }

        setLocalFiszki(localFiszki.filter((fiszka) => (fiszka.id && fiszka.id != idFiszki) || (fiszka.tempId && fiszka.tempId != tempIdFiszki)));
    }

    return (
        <div className='flex flex-col'>
            <div className={"bg-[#2b0f54] px-4 py-3 flex flex-wrap justify-between items-center shadow-md sticky top-0"}>

                <span className="text-lg">{nazwa}</span>

                <div className="flex gap-3">
                    <button onClick={() => setOpen(!open)} className="bg-[#ff4f69] hover:bg-[#ff8093] px-3 py-1 rounded-lg transition text-sm">
                        {open ? "Zamknij" : "Edytuj"}
                    </button>

                    <button className="bg-[#ab1f65] hover:bg-[#c72a78] px-3 py-1 rounded-lg transition text-sm">
                        Usuń
                    </button>
                </div>           

            </div>

            <div className={"bg-[#3e157c] w-full overflow-hidden transition-all duration-150 p-2 " + (open ? "opacity-100" : "max-h-0 opacity-0")}>
                <div className='overflow-y-auto flex flex-col space-y-3'>
                    {localFiszki.map((fiszka, index) => (
                        <div className='flex flex-col items-start p-2 bg-[#511fa3] rounded-xl'>
                            <label htmlFor="slowo" className='text-white text-sm mb-1'>
                            Słowo:
                            </label>
                            <input
                            className='w-full p-2 rounded-md bg-[#2b0f54] text-white outline-none border border-[#2b0f54] focus:border-[#ff4f69] transition-colors'
                            name='slowo'
                            type='text'
                            value={fiszka.slowo}
                            onChange={(e) => handleChange(index, "slowo", e.target.value, fiszka.id, fiszka.tempId)}
                            />

                            <label htmlFor="definicja" className='text-white text-sm mt-2 mb-1'>
                            Definicja:
                            </label>
                            <textarea
                            className='w-full p-2 rounded-md bg-[#2b0f54] text-white outline-none border border-[#2b0f54] focus:border-[#ff4f69] transition-colors'
                            name='definicja'
                            type='text'
                            value={fiszka.definicja}
                            onChange={(e) => handleChange(index, "definicja", e.target.value, fiszka.id, fiszka.tempId)}
                            />

                            <label htmlFor="zdanie" className='text-white text-sm mt-2 mb-1'>
                            Zdanie:
                            </label>
                            <textarea
                            className='w-full p-2 rounded-md bg-[#2b0f54] text-white outline-none border border-[#2b0f54] focus:border-[#ff4f69] transition-colors'
                            name='zdanie'
                            value={fiszka.zdanie}
                            onChange={(e) => handleChange(index, "zdanie", e.target.value, fiszka.id, fiszka.tempId)}
                            />

                            <button onClick={() => usunFiszke(fiszka.id, fiszka.tempId)} className="bg-[#ab1f65] hover:bg-[#c72a78] px-3 py-1 rounded-xl transition mt-2">
                                Usuń
                            </button>
                        </div>
                    ))}
                    <div className="mt-3 flex gap-4">
                        <button onClick={dodajFiszke} className="bg-[#ff4f69] hover:bg-[#ff8093] px-6 py-2 rounded-xl transition">
                        Dodaj nową
                        </button>
                        <button className="bg-[#2b0f54] hover:bg-[#533e70] px-6 py-2 rounded-xl transition">
                        Zapisz
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
  }

  /*
  {
    "id": 1,
    "slowo": "Fotosynteza",
    "definicja": "Proces, w którym rośliny przekształcają światło w energię.",
    "zdanie": "Rośliny wykorzystują fotosyntezę do wzrostu.",
    "groupid": 1
}*/