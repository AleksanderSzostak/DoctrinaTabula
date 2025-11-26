import { useState, useEffect } from "react";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [post, setPost] = useState(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch("/.netlify/functions/getPost")
      .then((r) => r.json())
      .then((data) => setPost(data))
  }, []);

  console.log("POST:", post);

  return (
    <>
      <h1>Vite + React</h1>
      {post && <pre>{JSON.stringify(post, null, 2)}</pre>}
    </>
  );
}

export default App;
