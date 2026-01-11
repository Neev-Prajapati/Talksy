import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/hello")
      .then(res => res.json())
      .then(result => setMessage(result.message));
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h1>Talksy</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
