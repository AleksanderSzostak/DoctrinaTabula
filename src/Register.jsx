import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";


export default function Register() {
    const [nazwaVar, setNazwaVar] = useState("");
    const [hasloVar, setHasloVar] = useState("");
    const [hasloPotwierdzVar, setHasloPotwierdzVar] = useState("");
    const navigate = useNavigate();

    async function zarejestrujSie(event) {
        event.preventDefault();

        if (hasloVar !== hasloPotwierdzVar) {
            alert("Pole hasło i potwierdź hasło muszą się zgadzać!");
            return;
        }

        let nazwaTrim = nazwaVar.trim();
        let hasloTrim = hasloVar.trim();

        if (nazwaTrim === "" || hasloTrim === "") {
            alert("Wypełnij wszystkie pola!");
            return;
        }

        const res = await fetch("http://localhost:8080/sprawdzUzytkownika/" + nazwaTrim);
        const data = await res.json();
        if (data.exists) {
            alert("Użytkownik o takiej nazwie już istnieje");
            return;
        }



        let status = 0;
        fetch("http://localhost:8080/register", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ nazwaTrim, hasloTrim }),
        })
        .then(res => {
            status = res.status;
            return res.json();
        })
        .then(data => {
            if (status === 200) {
                alert("Rejestracja przebiegła pomyślnie!")
                navigate("/login")
            } else {
                alert("Rejestracja się nie udała, poczekaj chwilę i spróbuj ponownie.")
            }
        })
        .catch(err => {
            console.error("Fetch error:", err);
        });
    }

    return (
        // <>
        // <form onSubmit={zarejestrujSie}>
        //     <label htmlFor="nazwa">Nazwa użytkownika:</label>
        //     <input
        //         type="text"
        //         name="nazwa"
        //         id="nazwa"
        //         value={nazwaVar}
        //         onChange={(e) => setNazwaVar(e.target.value)}
        //     />

        //     <label htmlFor="haslo">Hasło:</label>
        //     <input
        //         type="password"
        //         name="haslo"
        //         id="haslo"
        //         value={hasloVar}
        //         onChange={(e) => setHasloVar(e.target.value)}
        //     />
            
        //     <label htmlFor="haslo">Potwierdź hasło:</label>
        //     <input
        //         type="password"
        //         name="potwierdzHaslo"
        //         id="potwierdzHaslo"
        //         value={hasloPotwierdzVar}
        //         onChange={(e) => setHasloPotwierdzVar(e.target.value)}
        //     />

        //     <button type="submit">Zarejestruj się</button>
        //     <p>Masz już konto? <Link to="/login">Zaloguj się</Link></p>
        //     </form>
        // </>
        <div className="min-h-screen w-full flex items-center justify-center bg-[#2b0f54]">
            <div className="w-full max-w-md bg-[#ab1f65] rounded-3xl shadow-xl p-8 flex flex-col">
            <form
                onSubmit={zarejestrujSie}
                className="flex flex-col gap-4"
                >
                <h2 className="text-4xl text-white text-center mb-4">
                    Rejestracja
                </h2>

                <label htmlFor="nazwa" className="text-white text-lg">
                    Nazwa użytkownika
                </label>
                <input
                type="text"
                name="nazwa"
                id="nazwa"
                value={nazwaVar}
                onChange={(e) => setNazwaVar(e.target.value)}
                className="rounded-xl px-4 py-2 text-lg bg-[#ffd6e0] text-[#2b0f54]"
                />

                <label htmlFor="haslo" className="text-white text-lg">
                    Hasło
                </label>
                <input
                type="password"
                name="haslo"
                id="haslo"
                value={hasloVar}
                onChange={(e) => setHasloVar(e.target.value)}
                className="rounded-xl px-4 py-2 text-lg bg-[#ffd6e0] text-[#2b0f54]"
                />

                <label htmlFor="potwierdzHaslo" className="text-white text-lg">
                    Potwierdź hasło
                </label>
                <input
                type="password"
                name="potwierdzHaslo"
                id="potwierdzHaslo"
                value={hasloPotwierdzVar}
                onChange={(e) => setHasloPotwierdzVar(e.target.value)}
                className="rounded-xl px-4 py-2 text-lg bg-[#ffd6e0] text-[#2b0f54]"
                />


                <button
                    type="submit"
                    className="mt-4 bg-[#ff4f69] text-white text-xl py-2 rounded-xl hover:bg-[#ff6f85]"
                >
                    Zarejestruj się
                </button>

                <p className="text-white text-center mt-4">
                    Masz konto?{" "}
                    <Link
                    to="/login"
                    className="text-[#49e7ec] hover:underline"
                    >
                    Zaloguj się
                    </Link>
                </p>
                </form>

            </div>
        </div>
    );
}
