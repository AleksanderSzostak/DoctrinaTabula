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
            console.log("Logging in with:", nazwaTrim, hasloTrim);
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
