import React, { useState, useEffect } from 'react';
import Quiz from './Quiz';
import './App.css'; // For general app styling
import './Tabs.css'; // For tab-specific styling

// Directly import the JSON files from the src folder
import paper4 from './paper4.json';
import paper5 from './paper5.json';
import paper6 from './paper6.json';
import paper7 from './paper7.json';
import paper8 from './paper8.json';
import paper9 from './paper9.json';

function App() {
  // Map paper names to their corresponding question data
  const paperData = {
    paper4,
    paper5,
    paper6,
    paper7,
    paper8,
    paper9
  };

  const quizPapers = Object.keys(paperData);

  const [activeTab, setActiveTab] = useState(quizPapers[0]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    const fetchQuestions = (paperName) => {
      setLoading(true);
      setError(null);
      try {
        const data = paperData[paperName];
        const shuffledQuestions = shuffleArray([...data]); // Clone before shuffling
        setQuestions(shuffledQuestions);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions(activeTab);
  }, [activeTab]);

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
            {paperName.replace('paper', 'Paper ')}
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
