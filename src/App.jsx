import { useEffect, useRef, useState } from 'react';
import './index.css';

const suggestions = ['tomato', 'tom cruise', 'tetul', 'technology'];

function App() {
  const [userInput, setUserInput] = useState('');
  const [arrayOfWords, setArrayOfWords] = useState([]);
  const [caretPosition, setCaretPosition] = useState(0);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  const inputRef = useRef(null);
  const invisibleRef = useRef(null);

  useEffect(() => {
    if (inputRef === null) return;
    if (inputRef.current === null) return;

    const filteredWords = userInput.split(' ').filter((word) => {
      return {
        word,
        color: word.toLowerCase().startsWith('tomato') ? 'red' : 'black',
      };
    });

    setArrayOfWords(filteredWords);

    const currentlyTypedWord = userInput.split(' ').pop();
    if (currentlyTypedWord) {
      const filteredSuggestion = suggestions.filter((suggestion) => {
        if (suggestion.startsWith(currentlyTypedWord.toLowerCase())) {
          return true;
        } else {
          return false;
        }
      });
      setFilteredSuggestions(filteredSuggestion);
    } else {
      setFilteredSuggestions([]);
    }

    const getCaretPosition = (element, position) => {
      const { style } = invisibleRef.current;
      const { fontSize, fontFamily } = window.getComputedStyle(element.current);
      style.fontSize = fontSize;
      style.fontFamily = fontFamily;
      invisibleRef.current.innerText = userInput.substring(0, position);

      const caretX = invisibleRef.current.offsetWidth;
      setCaretPosition(caretX);
    };

    if (inputRef.current) {
      const selectionStart = inputRef.current.selectionStart;
      getCaretPosition(inputRef, selectionStart);
    }
  }, [userInput]);

  const handleChange = (e) => {
    setUserInput(e.target.value.replace(/[^a-zA-Z0-9 ]+/, ''));
  };

  return (
    <div className="mainDiv">
      <div className="mainDiv__content">
        <input
          maxLength={64}
          ref={inputRef}
          onChange={handleChange}
          value={userInput}
          className="mainDiv__input"
          type="text"
        />
        <span className="mainDiv__inputPlaceholder">
          {arrayOfWords.map((word, index) => {
            const indexOfTomato = word.toLowerCase().indexOf('tomato');
            return (
              <span key={index}>
                {word.toLowerCase().includes('tomato') ? (
                  <>
                    <span>{word.substring(0, indexOfTomato)}</span>
                    <span style={{ color: 'red' }}>
                      {word.substring(indexOfTomato, indexOfTomato + 6)}
                    </span>
                    <span>
                      {word.substring(indexOfTomato + 6, word.length)}
                    </span>
                  </>
                ) : (
                  word
                )}
                {'\u00A0'}
              </span>
            );
          })}
        </span>
        {userInput && filteredSuggestions.length > 0 && (
          <div
            style={{
              left: `${caretPosition < 361 ? 10 + caretPosition : 370}px`,
            }}
            className="mainDiv__tooltip"
          >
            {filteredSuggestions.map((suggestion) => (
              <p key={suggestion}>{suggestion}</p>
            ))}
          </div>
        )}
        <div ref={invisibleRef} className="mainDiv__invisible"></div>
      </div>
    </div>
  );
}

export default App;
