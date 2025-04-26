import React, { useState } from 'react';

function Ai() {
  const apiKey = import.meta.env.VITE_API_KEY;
  const [output, setOutput] = useState('');
  const [prompt, setPrompt] = useState('');  
  const [input, setInput] = useState(''); 

  const handleSubmit = async () => {
    if (!input.trim()) {
      setOutput('Please enter a prompt to get a response.');
      return;
    }
    setPrompt(input); 
    setOutput('Loading...');
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: input }],
              },
            ],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 2048,
            },
          }),
        }
      );
      const data = await response.json();
      console.log(data);

      const responseText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response.';
      setOutput(responseText);
    } catch (error) {
      console.error('Error:', error);
      setOutput('Error calling API');
    }
  };
  return (
    <div>
      <h1>AI Output:</h1>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter your prompt here"
      />
      <button onClick={handleSubmit}>Generate</button>
      <p>{output}</p>
    </div>
  );
}

export default Ai;
