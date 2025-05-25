import React, { useState, useEffect } from 'react';
import './Quiz.css'; // For quiz specific styling

function Quiz({ questions }) {
  const [currentAnswers, setCurrentAnswers] = useState({}); // Stores user's selected answers
  const [showResults, setShowResults] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState({}); // To store shuffled options for each question

  useEffect(() => {
    // Shuffle options for each question when component mounts or questions change
    const newShuffledOptions = {};
    questions.forEach((question, index) => {
      newShuffledOptions[index] = shuffleArray(Object.keys(question.options));
    });
    setShuffledOptions(newShuffledOptions);
  }, [questions]);

  const handleOptionChange = (questionIndex, optionKey) => {
    setCurrentAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionIndex]: optionKey
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setShowResults(true);
  };

  const calculateResults = () => {
    let correctCount = 0;
    questions.forEach((question, index) => {
      if (currentAnswers[index] === question.correct_answer) {
        correctCount++;
      }
    });
    const totalQuestions = questions.length;
    const incorrectCount = totalQuestions - correctCount;
    return { correctCount, incorrectCount, totalQuestions };
  };

  const { correctCount, incorrectCount, totalQuestions } = calculateResults();

  // Fisher-Yates (Knuth) shuffle algorithm
  const shuffleArray = (array) => {
    let currentIndex = array.length, randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
  };

  const handleRefresh = () => {
    window.location.reload(); // Reloads the page to shuffle questions and options
  };

  return (
    <div className="quiz-container">
      <form onSubmit={handleSubmit}>
        {questions.map((question, qIndex) => (
          <div key={qIndex} className="question-block">
            <p className="question-text">{question.question}</p>
            <div className="options-group">
              {shuffledOptions[qIndex] && shuffledOptions[qIndex].map(optionKey => (
                <div key={optionKey} className="option-item">
                  <input
                    type="radio"
                    id={`q${qIndex}-option-${optionKey}`}
                    name={`question-${qIndex}`}
                    value={optionKey}
                    checked={currentAnswers[qIndex] === optionKey}
                    onChange={() => handleOptionChange(qIndex, optionKey)}
                    disabled={showResults} // Disable input after submitting
                  />
                  <label htmlFor={`q${qIndex}-option-${optionKey}`}>
                    {`${optionKey.toUpperCase()}. ${question.options[optionKey]}`}
                  </label>
                  {showResults && (
                    <span className="result-indicator">
                      {optionKey === question.correct_answer ? (
                        <span className="correct-answer"> (Correct)</span>
                      ) : currentAnswers[qIndex] === optionKey ? (
                        <span className="incorrect-answer"> (Your Answer - Incorrect)</span>
                      ) : null}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        {!showResults && (
          <button type="submit" className="submit-button">Submit Quiz</button>
        )}
      </form>

      {showResults && (
        <div className="results-summary">
          <h2>Quiz Results</h2>
          <p>Total Questions: {totalQuestions}</p>
          <p className="correct-count">Correct Answers: {correctCount}</p>
          <p className="incorrect-count">Incorrect Answers: {incorrectCount}</p>
          <button onClick={handleRefresh} className="refresh-button">Refresh Quiz</button>
        </div>
      )}
    </div>
  );
}

export default Quiz;