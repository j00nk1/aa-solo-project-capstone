import React, { useRef, useState, useEffect, useMemo } from "react";
import useTyping, { CharStateType, PhaseType } from "react-typing-game-hook";

function TypingInput({ text }) {
  const [duration, setDuration] = useState("0:00");
  const [isFocused, setIsFocused] = useState(false);
  const letterElements = useRef(null); // to access the element, letterElements.current

  // destructure from useTyping packet
  const {
    states: {
      charsState,
      currIndex,
      phase,
      correctChar,
      errorChar,
      startTime,
      endTime,
    },
    actions: { insertTyping, deleteTyping, resetTyping },
  } = useTyping(text?.content, {
    skipCurrentWordOnSpace: false,
  });

  // track cursor position, and adjust the position depending on the paragraph's size change.
  const pos = useMemo(() => {
    // letterElements.current will be the whole text's container
    if (currIndex !== -1 && letterElements.current) {
      let spanRef = letterElements.current.children[currIndex]; // .children is all the letters in the text and select specific letter with currIndex
      // these following lines will take care of the cursor position adjustment
      // offsetLeft => distance from the most left element to the current position
      // offsetWidth => each characters' width (ex. " " is 0, "m" is 8)
      let left = spanRef.offsetLeft + spanRef.offsetWidth - 2;
      let top = spanRef.offsetTop - 2;
      return { left, top };
    } else {
      // initial cursor position
      return {
        left: -2,
        top: 2,
      };
    }
  }, [currIndex]);

  useEffect(() => {
    if (phase === PhaseType.Ended && endTime && startTime) {
      const dur = endTime - startTime;
      const min = Math.floor(dur / 60000); // convert it into min
      const sec = (dur % 60000) / 1000; // convert it into sec
      const minSec = min + "m" + (sec < 10 ? "0" : "") + sec + "s";
      setDuration(minSec);
    }
  }, [phase, startTime, endTime]);

  //handle key presses
  const handleKeyDown = (letter, control) => {
    // determine what key was pressed
    if (letter === "Escape") {
      resetTyping();
    } else if (letter === "Backspace") {
      deleteTyping(control);
    } else if (letter.length === 1) {
      // if the pressed key's val is a single char
      insertTyping(letter);
    }
  };

  return (
    <div>
      <div
        tabIndex={0}
        onKeyDown={e => handleKeyDown(e.key, e.ctrlKey)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`text-xl outline-none relative font-serif`}
      >
        <div
          ref={letterElements}
          className="tracking-wide pointer-events-none select-none mb-4"
          tabIndex={0}
        >
          {text?.content.split("").map((letter, index) => {
            let state = charsState[index];
            let color =
              state === CharStateType.Incomplete
                ? "white"
                : state === CharStateType.Correct
                ? "green"
                : "red";
            return (
              <span key={letter + index} className={`${color}`}>
                {letter}
              </span>
            );
          })}
        </div>
        {phase !== PhaseType.Ended && isFocused ? (
          <span
            style={{
              left: pos.left,
              top: pos.top,
            }}
            className={`caret border-l-2 border-white`}
          >
            &nbsp;
          </span>
        ) : null}
      </div>
      <p className="text-sm">
        {phase === PhaseType.Ended && startTime && endTime ? (
          <>
            <span className="text-green-500 mr-4">
              WPM: {Math.round(((60 / duration) * correctChar) / 5)}
            </span>
            <span className="text-blue-500 mr-4">
              Accuracy: {((correctChar / text.length) * 100).toFixed(2)}%
            </span>
            <span className="text-yellow-500 mr-4">Duration: {duration}s</span>
          </>
        ) : null}
        <span className="mr-4"> Current Index: {currIndex}</span>
        <span className="mr-4"> Correct Characters: {correctChar}</span>
        <span className="mr-4"> Error Characters: {errorChar}</span>
      </p>
    </div>
  );
}

export default TypingInput;
