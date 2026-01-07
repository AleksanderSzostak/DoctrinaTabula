import React, { useState } from 'react';

export default function Login() {
    const [nazwaVar, setNazwaVar] = useState("");
    const [hasloVar, setHasloVar] = useState("");

    function zalogujSie(event) {
        event.preventDefault();

        let nazwaTrim = nazwaVar.trim();
        let hasloTrim = hasloVar.trim();

        if (nazwaTrim === "" || hasloTrim === "") {
            alert("Wypełnij oba pola!");
        } else {
            fetch("http://localhost:8080/login", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nazwaTrim, hasloTrim }),
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
            })
            .catch(err => {
                console.error("Fetch error:", err);
            });
        }
    }

    return (
        <form onSubmit={zalogujSie}>
            <label htmlFor="nazwa">Nazwa użytkownika:</label>
            <input
                type="text"
                name="nazwa"
                id="nazwa"
                value={nazwaVar}
                onChange={(e) => setNazwaVar(e.target.value)}
            />

            <label htmlFor="haslo">Hasło:</label>
            <input
                type="password"
                name="haslo"
                id="haslo"
                value={hasloVar}
                onChange={(e) => setHasloVar(e.target.value)}
            />

            <button type="submit">Zaloguj się</button>
        </form>
    );
}
