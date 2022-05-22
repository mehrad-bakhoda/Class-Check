import { useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("/api/roll", {
      method: "POST",
      body: JSON.stringify({
        name: name,
        code: code,
      }),
    });
  };

  return (
    <>
      <label>
        {" "}
        Enter the class code:
        <input
          type="text"
          name="code"
          onChange={(e) => setCode(e.target.value)}
          value={code}
        />
      </label>
      <label>
        {" "}
        Enter your first and family name :
        <input
          type="text"
          name="name"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
      </label>
    </>
  );
}
