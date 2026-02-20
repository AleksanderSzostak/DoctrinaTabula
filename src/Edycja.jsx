import { Link, useNavigate, useBlocker } from 'react-router-dom';
import { useEffect, useState } from "react";

let fiszkiDoZmiany = {dodaneGrupy: [], zmienioneGrupy: [], usunieteGrupy: [], dodaneFiszki: [], zmienioneFiszki: [], usunieteFiszki: []};
let increment = 1;
let increment2 = 1;
let odrzucZmianyLicznik = 0;
let refreshPage = 0;


export default function Edycja() {
    const [localGrupy, setLocalGrupy] = useState(null);
    const [loading, setLoading] = useState(true);
    const [shouldConfirm, setShouldConfirm] = useState(false);
    const navigate = useNavigate();

    confirmChangesOnLeave(shouldConfirm);
    confirmChangesOnRoute(shouldConfirm);

    useEffect(() => {
        if (localStorage.getItem("loggedIn") !== "true") {
            navigate("/login");
        }

        function checkIfLoaded() {
            if (localStorage.getItem("fiszki")) {
                console.log(JSON.parse(localStorage.getItem("fiszki")))
                setLocalGrupy(JSON.parse(localStorage.getItem("fiszki")));
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
    }, [refreshPage]);

    async function wyloguj() {
        if (shouldConfirm && !confirm("If you logout you will lose all your changes")) {
            return;
        }
        setShouldConfirm(false);
        await fetch("https://doctrina-tabula-s867.vercel.app:8080/logout", {
            method: "POST",
            credentials: "include"
        });

        localStorage.clear();
        navigate("/");
    }

    function confirmChangesOnRoute(when) {
        const blocker = useBlocker(when);

        useEffect(() => {
            if (blocker.state === "blocked") {
                const confirmLeave = window.confirm(
                    "Are you sure you want to leave this page?"
                );

                if (confirmLeave) {
                    blocker.proceed();
                } else {
                    blocker.reset();
                }
            }
        }, [blocker]);
    }

    function confirmChangesOnLeave(when) {
        useEffect(() => {
            const handleBeforeUnload = (event) => {
              if (!when) return;
              event.preventDefault();
              event.returnValue = "";
            };
        
            window.addEventListener("beforeunload", handleBeforeUnload);
            return () => {
              window.removeEventListener("beforeunload", handleBeforeUnload);
            };
          }, [when]);
    }

    function dodajGrupe() {
        fiszkiDoZmiany.dodaneGrupy.push({ tempId: increment2, nazwa: "" });
        setLocalGrupy([...localGrupy, {fiszki: [], nazwa: "", tempId: increment2++}]);
        setShouldConfirm(true);
    }

    function odrzucZmiany() {
        fiszkiDoZmiany = {dodaneGrupy: [], zmienioneGrupy: [], usunieteGrupy: [], dodaneFiszki: [], zmienioneFiszki: [], usunieteFiszki: []};
        setLocalGrupy(JSON.parse(localStorage.getItem("fiszki")));
        setShouldConfirm(true);
        odrzucZmianyLicznik++;
    }

    async function zapiszZmiany() {
        if (JSON.stringify(fiszkiDoZmiany) == JSON.stringify({dodaneGrupy: [], zmienioneGrupy: [], usunieteGrupy: [], dodaneFiszki: [], zmienioneFiszki: [], usunieteFiszki: []})) {
            return;
        }
        console.log(JSON.stringify(fiszkiDoZmiany))
        const request = await fetch("https://doctrina-tabula-s867.vercel.app:8080/zapiszFiszki", {method: "POST", credentials: "include", headers: {
            "Content-Type": "application/json"
        }, body: JSON.stringify(fiszkiDoZmiany, (key, value) => {
            return value === undefined ? -1 : value;
          })}); 

        if (request.status == 401) {
            const request = await fetch("https://doctrina-tabula-s867.vercel.app:8080/refresh", {
                method: "POST",
                credentials: "include"
              })

            if (request.ok) {
                const request = await fetch("https://doctrina-tabula-s867.vercel.app:8080/zapiszFiszki", {method: "POST", credentials: "include", headers: {
                    "Content-Type": "application/json"
                }, body: JSON.stringify(fiszkiDoZmiany, (key, value) => {
                    return value === undefined ? -1 : value;
                  })}); 

                if (request.ok) {
                    navigate("/");
                } else {
                    alert("Błąd serwera, fiszki nie zostały zapisane, poczekaj chwilę i spróbuj ponownie.");
                }
            } else if (request.status === 401) {
                localStorage.clear();
                navigate("/login")
            } else {
                alert("Błąd serwera, fiszki nie zostały zapisane, poczekaj chwilę i spróbuj ponownie.");
            }
        } 
        else if (request.ok) {
                navigate("/");
            } else {
                alert("Błąd serwera, fiszki nie zostały zapisane, poczekaj chwilę i spróbuj ponownie.");
            }
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
                    {localGrupy.map((grupa, index) => (
                    <Grupa key={index} setShouldConfirm={setShouldConfirm} tempIdGrupy={grupa.tempId} idGrupy={grupa.id} nazwa={grupa.nazwa} fiszki={grupa.fiszki} localGrupy={localGrupy} setLocalGrupy={setLocalGrupy} />
                    ))}
                </div>

                <div className="mt-6 flex gap-4">
                    <button onClick={dodajGrupe} className="bg-[#ff4f69] hover:bg-[#ff8093] px-6 py-2 rounded-xl transition">
                    Dodaj nową
                    </button>
                    <button onClick={zapiszZmiany} className="bg-[#2b0f54] hover:bg-[#533e70] px-6 py-2 rounded-xl transition">
                    Zapisz i wyjdź
                    </button>
                    <button onClick={odrzucZmiany} className="bg-[#a71d13] hover:bg-[#995a56] px-6 py-2 rounded-xl transition">
                    Odrzuć zmiany
                    </button>
                </div>
                </div>
            </div>
        </>
      );
}

function Grupa({ idGrupy, tempIdGrupy, nazwa, fiszki, localGrupy, setLocalGrupy, setShouldConfirm }) {
    const [open, setOpen] = useState(tempIdGrupy ? true : false);
    const [localFiszki, setLocalFiszki] = useState(fiszki);
      
 
    useEffect(() => {setLocalFiszki(fiszki); setOpen(tempIdGrupy ? true : false)}, [odrzucZmianyLicznik]);

    function handleChange(index, field, value, idFiszki, tempIdFiszki) {
        const updated = [...localFiszki];
        updated[index][field] = value;

        if (tempIdFiszki) {
            let indexFiszki = fiszkiDoZmiany.dodaneFiszki.findIndex((fiszka) => tempIdFiszki == fiszka.tempId);
            if (indexFiszki !== -1) {
                fiszkiDoZmiany.dodaneFiszki.splice(indexFiszki, 1, {groupId: idGrupy, tempIdGrupy: tempIdGrupy, tempId: tempIdFiszki, slowo: updated[index]["slowo"], definicja: updated[index]["definicja"], zdanie: updated[index]["zdanie"]});
            } else {
                fiszkiDoZmiany.dodaneFiszki.push({groupId: idGrupy, tempIdGrupy: tempIdGrupy, tempId: tempIdFiszki, slowo: updated[index]["slowo"], definicja: updated[index]["definicja"], zdanie: updated[index]["zdanie"]});
            } 
        } else {
            let indexFiszki = fiszkiDoZmiany.zmienioneFiszki.findIndex((fiszka) => idFiszki == fiszka.id);
            if (indexFiszki !== -1) {
                fiszkiDoZmiany.zmienioneFiszki.splice(indexFiszki, 1, {groupId: idGrupy, tempIdGrupy: tempIdGrupy, id: idFiszki, slowo: updated[index]["slowo"], definicja: updated[index]["definicja"], zdanie: updated[index]["zdanie"]});
            } else {
                fiszkiDoZmiany.zmienioneFiszki.push({groupId: idGrupy, tempIdGrupy: tempIdGrupy, id: idFiszki, slowo: updated[index]["slowo"], definicja: updated[index]["definicja"], zdanie: updated[index]["zdanie"]});
            }
        }
        
        console.log(fiszkiDoZmiany)
        setLocalFiszki(updated);
        setShouldConfirm(true);
    }

    function dodajFiszke() {
        fiszkiDoZmiany.dodaneFiszki.push({groupId: idGrupy, tempIdGrupy: tempIdGrupy, tempId: increment, slowo: "", definicja: "", zdanie: ""});
        setLocalFiszki([...localFiszki, {groupId: idGrupy, tempIdGrupy: tempIdGrupy, slowo: "", definicja: "", zdanie: "", tempId: increment++}]);
        setShouldConfirm(true);
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
        setShouldConfirm(true);
    }

    function handleGroupChange(nazwaGrupy) {
        if (tempIdGrupy) {
            let index = fiszkiDoZmiany.dodaneGrupy.findIndex((grupa) => grupa.tempId == tempIdGrupy);
            if (index !== -1) {
                fiszkiDoZmiany.dodaneGrupy.splice(index, 1, {tempId: tempIdGrupy, nazwa: nazwaGrupy});
            } else {
                fiszkiDoZmiany.dodaneGrupy.push({tempId: tempIdGrupy, nazwa: nazwaGrupy});
            }
        } else {
            let index = fiszkiDoZmiany.zmienioneGrupy.findIndex((grupa) => grupa.id == idGrupy);
            if (index !== -1) {
                fiszkiDoZmiany.zmienioneGrupy.splice(index, 1, {id: idGrupy, nazwa: nazwaGrupy});
            } else {
                fiszkiDoZmiany.zmienioneGrupy.push({id: idGrupy, nazwa: nazwaGrupy});
            }
        }
        
        let nextGrupy = localGrupy.map(grupa => {
            if ((idGrupy && grupa.id === idGrupy) || (tempIdGrupy && grupa.tempId === tempIdGrupy)) {
                return {...grupa, nazwa: nazwaGrupy};
            } else {
                return grupa;
            }
        });
        setLocalGrupy(nextGrupy);
        setShouldConfirm(true);

        console.log(fiszkiDoZmiany)
    }

    function usunGrupe() {
        if (idGrupy) {
            let index = fiszkiDoZmiany.zmienioneGrupy.findIndex((grupa) => grupa.id == idGrupy);
            fiszkiDoZmiany.zmienioneGrupy.splice(index);
            fiszkiDoZmiany.usunieteGrupy.push({id: idGrupy});
        } else {
            let index = fiszkiDoZmiany.dodaneGrupy.findIndex((grupa) => grupa.tempId == tempIdGrupy);
            fiszkiDoZmiany.dodaneGrupy.splice(index);
        }
        
        setLocalGrupy(localGrupy.filter((grupa) => (grupa.id && grupa.id != idGrupy) || (grupa.tempId && grupa.tempId != tempIdGrupy)));
        setShouldConfirm(true);
    }

    return (
        <div className='flex flex-col'>
            <div className={"bg-[#2b0f54] px-4 py-3 flex justify-between items-center shadow-md sticky top-0"}>

                <input value={nazwa} onChange={(e) => handleGroupChange(e.target.value)} type='text' className="w-full mr-4 p-2 rounded-md bg-[#3e157c] text-white outline-none border border-[#2b0f54] focus:border-[#ff4f69] transition-colors"></input>

                <div className="flex gap-3">
                    <button onClick={() => setOpen(!open)} className="bg-[#ff4f69] hover:bg-[#ff8093] px-3 py-1 rounded-lg transition text-sm">
                        {open ? "Zamknij" : "Edytuj"}
                    </button>

                    <button onClick={usunGrupe} className="bg-[#ab1f65] hover:bg-[#c72a78] px-3 py-1 rounded-lg transition text-sm">
                        Usuń
                    </button>
                </div>           

            </div>

            <div className={"bg-[#3e157c] w-full overflow-hidden transition-all duration-250 p-2 " + (open ? "opacity-100" : "max-h-0 opacity-0")}>
                <div className='overflow-y-auto flex flex-col space-y-3'>
                    {localFiszki.map((fiszka, index) => (
                        <div key={index} className='flex flex-col items-start p-2 bg-[#511fa3] rounded-xl'>
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