import React, { useRef, useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import useTyping, { CharStateType, PhaseType } from "react-typing-game-hook";
import {
  addRecordThunk,
  editRecordThunk,
  getRecordsThunk,
} from "../../store/records";

function TypingInput({ data }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const user_id = sessionUser.id;
  const recordList = useSelector(state => Object.values(state.records));
  const text = data?.currQuote;
  const score = data?.score;

  useEffect(() => {
    if (!recordList.length) dispatch(getRecordsThunk());
  }, [dispatch, recordList]);

  const currRecord = recordList.filter(
    record => record.user_id === user_id && record.quote_id === text?.id
  );
  const [isFocused, setIsFocused] = useState(false);
  // to access the element, letterElements.current
  const letterElements = useRef(null);

  // for rendering purpose
  const [time, setTime] = useState(0);
  const [timeDiff, setTimeDiff] = useState(0);
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
      // errorChar,
      startTime,
      endTime,
    },
    actions: { insertTyping, deleteTyping, resetTyping },
  } = useTyping(text?.content, {
    skipCurrentWordOnSpace: false, //
    pauseOnError: false, // When true, stays on the same character until it is correctly inputted. Otherwise, it moves on to the next character instead
  });

  // track cursor position, and adjust the position depending on the paragraph's size change.
  const pos = useMemo(() => {
    // letterElements.current will be the whole text's container
    if (currIndex !== -1 && letterElements.current) {
      let spanRef = letterElements.current.children[currIndex]; // .children is all the letters in the text and select specific letter with currIndex
      // these following lines will take care of the cursor position adjustment
      // offsetLeft => distance from the most left element to the current position
      // offsetWidth => each characters' width (ex. " " is 0, "m" is 8)
      let left = spanRef.offsetLeft + spanRef.offsetWidth;
      let top = spanRef.offsetTop - 2;
      return { left, top };
    } else {
      // initial cursor position
      return {
        left: -1,
        top: 2,
      };
    }
  }, [currIndex]);

  //set WPM, duration, accuracy
  useEffect(() => {
    if (phase === PhaseType.Ended && endTime && startTime) {
      const dur = endTime - startTime;
      const time = (dur % 60000) / 1000; // convert it into sec
      const durInSec = Math.floor(dur / 1000);
      setTime(time); // for rendering duration
      setTimeDiff(Math.round((time - score.duration) * 1000) / 1000);
      setRecordDuration(dur); // for recording duration
      setAccuracy(+((correctChar / text.content.length) * 100).toFixed(2)); // toFixed returns STRING
      setDisable(false);
      setWpm(Math.round(((60 / durInSec) * correctChar) / 5));
    } else {
      setTime(0);
    }
  }, [phase, startTime, endTime, correctChar, text?.content.length, score]);

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
        <div ref={letterElements} tabIndex={0} className="text_container">
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
      <div className="container_row game_score_container">
        {score ? (
          <div>
            <h2>Previous Score</h2>
            <p className="wpm score_in_game">WPM: {score.wpm}</p>
            <p className="acc score_in_game">Accuracy: {score.accuracy}%</p>
            <p className="dur score_in_game">Duration: {score.duration}s</p>
          </div>
        ) : null}
        <div>
          {phase === PhaseType.Ended && startTime && endTime ? (
            <>
              <h2>{score ? "New Score" : "Score"}</h2>
              <p className="wpm score_in_game">
                WPM: {wpm}
                {score && (
                  <>
                    {wpm - score.wpm > 0 ? (
                      <span className="positive"> +{wpm - score.wpm}👆</span>
                    ) : wpm - score.wpm ? (
                      <span className="negative"> {wpm - score.wpm}👇</span>
                    ) : null}
                  </>
                )}
              </p>
              <p className="acc score_in_game">
                Accuracy: {accuracy}%
                {score && (
                  <>
                    {accuracy - score.accuracy > 0 ? (
                      <span className="positive">
                        +{Math.round((accuracy - score.accuracy) * 100) / 100}
                        %👆
                      </span>
                    ) : accuracy - score.accuracy ? (
                      <span className="negative">
                        {Math.round((accuracy - score.accuracy) * 100) / 100}%👇
                      </span>
                    ) : null}
                  </>
                )}
              </p>
              <p className="dur score_in_game">
                Duration: {time}s
                {score && (
                  <>
                    {timeDiff > 0 ? (
                      <span className="negative">+{timeDiff}s🐢</span>
                    ) : +time - score.duration ? (
                      <span className="positive">{timeDiff}s🏃</span>
                    ) : null}
                  </>
                )}
              </p>
            </>
          ) : null}
          {/*👇 TODO: DELETE THIS BLOCK 👇 */}
          {/* <li> Current Index: {currIndex}</li>
          <li> Correct Characters: {correctChar}</li>
          <li> Error Characters: {errorChar}</li> */}
          {/*👆 TODO: DELETE THIS BLOCK 👆 */}
        </div>
      </div>
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
