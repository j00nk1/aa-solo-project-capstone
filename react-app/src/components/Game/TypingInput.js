import React, { useRef, useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import useTyping, { CharStateType, PhaseType } from "react-typing-game-hook";
import {
  addRecordThunk,
  editRecordThunk,
  getRecordsThunk,
} from "../../store/records";

function TypingInput({ text }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const user_id = sessionUser.id;
  const recordList = useSelector(state => Object.values(state.records));

  useEffect(() => {
    if (!recordList.length) dispatch(getRecordsThunk());
  }, [dispatch, recordList]);

  const currRecord = recordList.filter(
    record => record.user_id === user_id && record.quote_id === text?.id
  );
  const [isFocused, setIsFocused] = useState(false);
  const letterElements = useRef(null); // to access the element, letterElements.current

  // for rendering purpose
  const [time, setTime] = useState("0:00");
  // for recording purpose
  const [wpm, setWpm] = useState(0);
  const [duration, setRecordDuration] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [disable, setDisable] = useState(true);

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

  //set WPM, duration, accuracy
  useEffect(() => {
    if (phase === PhaseType.Ended && endTime && startTime) {
      const dur = endTime - startTime;
      const min = Math.floor(dur / 60000); // convert it into min
      const sec = (dur % 60000) / 1000; // convert it into sec
      const time = min + ":" + (sec < 10 ? "0" : "") + sec;
      const durInSec = Math.floor(dur / 1000);
      setTime(time); // for rendering duration
      setRecordDuration(dur); // for recording duration
      setAccuracy(+((correctChar / text.content.length) * 100).toFixed(2)); // toFixed returns STRING
      setDisable(false);
      setWpm(Math.round(((60 / durInSec) * correctChar) / 5));
    } else {
      setTime(0);
    }
  }, [phase, startTime, endTime, correctChar, text?.content.length]);

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

  // new submission
  const newSubmit = async () => {
    const record = {
      user_id,
      quote_id: text.id,
      accuracy,
      duration,
      wpm,
    };

    await dispatch(addRecordThunk(record));

    await history.push("/");
  };

  const update = async () => {
    const record = {
      id: currRecord[0].id,
      user_id,
      quote_id: text.id,
      accuracy,
      duration,
      wpm,
    };

    await dispatch(editRecordThunk(record));
    await history.push("/");
  };

  const back = () => {
    history.push("/");
  };

  return (
    <div className="typing_container">
      <div
        tabIndex={0}
        onKeyDown={e => handleKeyDown(e.key, e.ctrlKey)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        <div
          ref={letterElements}
          tabIndex={0}
          style={{ marginBottom: 10, border: "1px solid white", padding: 10 }}
        >
          {text?.content.split("").map((letter, index) => {
            let state = charsState[index];
            let color =
              state === CharStateType.Incomplete
                ? "grey"
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
            className={"caret input"}
          >
            &nbsp;
          </span>
        ) : null}
      </div>
      <ul>
        {phase === PhaseType.Ended && startTime && endTime ? (
          <>
            <li>WPM: {wpm}</li>
            <li>Accuracy: {accuracy}%</li>
            <li>Duration: {time}</li>
          </>
        ) : null}
        <li> Current Index: {currIndex}</li>
        <li> Correct Characters: {correctChar}</li>
        <li> Error Characters: {errorChar}</li>
      </ul>
      {!currRecord.length ? (
        <button onClick={newSubmit} disabled={disable}>
          Submit
        </button>
      ) : (
        <button onClick={update} disabled={disable}>
          Update Score
        </button>
      )}
      <button onClick={back}>Back to quote list</button>
    </div>
  );
}

export default TypingInput;
