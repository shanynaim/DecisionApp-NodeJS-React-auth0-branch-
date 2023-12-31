import { React, useState, useEffect } from "react";
import axios from "axios";
import Questions from "./Questions";
import URL from "../utils/config";
import data from "../utils/QuestionsData";
import { useNavigate } from "react-router-dom";

function Decision({ userId }) {
  const [message, setMessage] = useState(null);
  const [optionsMessage, setOptionsMessage] = useState(null);
  const [isFinish, setIsFinish] = useState(false);
  const [start, setStart] = useState(false);
  const [optionOne, setOptionOne] = useState({
    name: null,
    scores: {},
  });
  const [optionTwo, setOptionTwo] = useState({
    name: null,
    scores: {},
  });
  const [optionsArray, setOptionsArray] = useState(() => []);

  useEffect(() => {
    setOptionsArray([
      {
        name: optionOne.name,
        optionOne,
        setter: setOptionOne,
        queryScores: [],
        currentValue: 0,
      },
      {
        name: optionTwo.name,
        optionTwo,
        setter: setOptionTwo,
        queryScores: [],
        currentValue: 0,
      },
    ]);
  }, [optionOne, optionTwo]);

  useEffect(() => {
    if (isFinish) {
      const getProfile = async () => {
        try {
          const respond = await axios.post(`${URL}/decision/calculateScore`, {
            userId,
            optionOne: optionOne,
            optionTwo: optionTwo,
          });

          if (respond.data.ok) {
            setMessage(respond.data.data);
          }
        } catch (error) {
          console.log(error);
        }
      };

      getProfile();
    }
  }, [isFinish]);

  const setOptionChange = (e) => {
    if (e.target.id === "1") {
      const optionCopy = { ...optionOne };
      optionCopy[e.target.name] = e.target.value;

      setOptionOne(optionCopy);
    } else {
      const optionCopy = { ...optionTwo };
      optionCopy[e.target.name] = e.target.value;
      setOptionTwo(optionCopy);
    }
  };

  const startSubmit = (e) => {
    e.preventDefault();
    if (!optionOne.name || !optionTwo.name) {
      setOptionsMessage("options can't be empty");
    } else if (optionOne.name === optionTwo.name) {
      setOptionsMessage("options can't be identical");
    } else {
      setOptionsMessage(null);
      setStart(true);
    }
  };

  const startOver = () => {
    setStart(false);
    setMessage(null);
    setIsFinish(false);
    setOptionTwo({
      name: null,
      scores: {},
    });
    setOptionOne({
      name: null,
      scores: {},
    });
  };

  return (
    <>
      {start ? (
        <>
          <div>
            <Questions
              setIsFinish={setIsFinish}
              optionsArray={optionsArray}
              setOptionsArray={setOptionsArray}
              data={data}
            />
          </div>
          <button className="Decision_button" onClick={startOver}>
            Take another decision
          </button>
        </>
      ) : (
        <div className="Decision_container">
          <p className="Decision_text">
            Please provide your two options below. <br />
            For instance, 'going to the park' or 'traveling to Spain,' etc.
            <br />
            <br />
            Afterward, I will present phrases for each option, and you will need
            to score how well each sentence aligns with each option. <br />
            <br />
            Please note: My decision calculation is only character-based and
            doesn't consider other parameters like time, money, and so on.
          </p>
          <div className="Decision_inner-container">
            <form onSubmit={startSubmit} onChange={setOptionChange}>
              <label>OPTION ONE</label>
              <input id="1" name="name" type="text" />
              <label>OPTION TWO</label>

              <input id="2" name="name" type="text" />
              <button>LETS START!</button>
              {optionsMessage && <h1>{optionsMessage}</h1>}
            </form>
          </div>
        </div>
      )}

      {message &&
        (message === "equal" ? (
          <h1 className="Decision_final-message">
            Both option are equally good!
          </h1>
        ) : (
          <h1 className="Decision_final-message">{message}!</h1>
        ))}
    </>
  );
}

export default Decision;
