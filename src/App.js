import React, { useState, useEffect } from 'react';
import Quiz from './Quiz';
import './App.css'; // For general app styling
import './Tabs.css'; // For tab-specific styling

function App() {
  // Define the list of available quizzes/papers
  const quizPapers = [
    'paper4',
    'paper5',
    'paper6',
    'paper7',
    'paper8',
    'paper9'
  ];

  // State to keep track of the currently active tab (defaults to the first paper)
  const [activeTab, setActiveTab] = useState(quizPapers[0]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false); // Set to false initially as we load on tab change
  const [error, setError] = useState(null);

  // Function to fetch questions based on the active tab
  const fetchQuestions = async (paperName) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/${paperName}.JSON`); // Construct the path
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Shuffle questions after fetching
      const shuffledQuestions = shuffleArray(data);
      setQuestions(shuffledQuestions);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  // Fisher-Yates (Knuth) shuffle algorithm
  const shuffleArray = (array) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]
      ];
    }
    return array;
  };

  // Effect to fetch questions whenever the activeTab changes
  useEffect(() => {
    fetchQuestions(activeTab);
  }, [activeTab]); // Re-run when activeTab changes

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>special thanks to piyush</h1>
      </header>
      <nav className="tabs-container">
        {quizPapers.map((paperName) => (
          <button
            key={paperName}
            className={`tab-button ${activeTab === paperName ? 'active' : ''}`}
            onClick={() => handleTabClick(paperName)}
          >
            {paperName.replace('pAPER', 'Paper ')} {/* Display as "Paper 4", "Paper 5", etc. */}
          </button>
        ))}
      </nav>
      <main>
        {loading ? (
          <div className="container">Loading quiz...</div>
        ) : error ? (
          <div className="container error">Error loading quiz: {error.message}</div>
        ) : questions.length > 0 ? (
          <Quiz questions={questions} />
        ) : (
          <div className="container">No questions found for {activeTab}.</div>
        )}
      </main>
    </div>
  );
}

export default App;