import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";


export default function Login() {
    const [nazwaVar, setNazwaVar] = useState("");
    const [hasloVar, setHasloVar] = useState("");
    const navigate = useNavigate();

    function zalogujSie(event) {
        event.preventDefault();

        let nazwaTrim = nazwaVar.trim();
        let hasloTrim = hasloVar.trim();

        if (nazwaTrim === "" || hasloTrim === "") {
            alert("Wypełnij oba pola!");
        } else {
            let status = 0;
            fetch("http://localhost:8080/login", {
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
                if (status === 401) {
                    alert("Nieprawidłowa nazwa użytkownika lub hasło");
                } else if (status == 200) {
                    navigate("/");
                }
            })
            .catch(err => {
                console.error("Fetch error:", err);
            });
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#2b0f54]">
            <div className="w-full max-w-md bg-[#ab1f65] rounded-3xl shadow-xl p-8 flex flex-col">
            <form
                onSubmit={zalogujSie}
                className="flex flex-col gap-4"
                >
                <h2 className="text-4xl text-white text-center mb-4">
                    Logowanie
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


                <button
                    type="submit"
                    className="mt-4 bg-[#ff4f69] text-white text-xl py-2 rounded-xl hover:bg-[#ff6f85]"
                >
                    Zaloguj się
                </button>

                <p className="text-white text-center mt-4">
                    Nie masz konta?{" "}
                    <Link
                    to="/register"
                    className="text-[#49e7ec] hover:underline"
                    >
                    Zarejestruj się
                    </Link>
                </p>
                </form>

            </div>
        </div>

        // <>
        //     <form onSubmit={zalogujSie}>
        //         <label htmlFor="nazwa">Nazwa użytkownika:</label>
        //         <input
        //             type="text"
        //             name="nazwa"
        //             id="nazwa"
        //             value={nazwaVar}
        //             onChange={(e) => setNazwaVar(e.target.value)}
        //         />

        //         <label htmlFor="haslo">Hasło:</label>
        //         <input
        //             type="password"
        //             name="haslo"
        //             id="haslo"
        //             value={hasloVar}
        //             onChange={(e) => setHasloVar(e.target.value)}
        //         />

        //         <button type="submit">Zaloguj się</button>
        //     </form>
        //     <p>Nie masz konta? <Link to="/register">Zarejestruj się</Link></p>
        // </>
    );
}
