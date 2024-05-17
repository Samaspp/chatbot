'use client'
import { useState } from 'react';

export default function Home() {
  const [history, setHistory] = useState<{ user: string, assistant: string }[]>([]);
  const [input, setInput] = useState('');

  const askTheAI = async () => {
    if (input.trim()) {
      const userMessage = input.trim();

      try {
        const response = await fetch('/api/openai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: userMessage }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const assistantMessage = data.response;

        setHistory([...history, { user: userMessage, assistant: assistantMessage }]);
        setInput('');
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        setHistory([...history, { user: userMessage, assistant: 'Error: Could not get a response from the AI' }]);
        setInput('');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 space-y-4">
        <div className="space-y-2">
          {history.map((entry, index) => (
            <div key={index} className="space-y-1">
              <div className="text-right">
                <p className="inline-block bg-blue-500 text-white rounded-lg px-4 py-2 max-w-xs break-words">{entry.user}</p>
              </div>
              <div className="text-left">
                <p className="inline-block bg-gray-300 text-black rounded-lg px-4 py-2 max-w-xs break-words">{entry.assistant}</p>
              </div>
            </div>
          ))}
        </div>
        <textarea
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          placeholder="Ask the AI..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
          onClick={askTheAI}
        >
          Ask the AI
        </button>
      </div>
    </div>
  );
}
