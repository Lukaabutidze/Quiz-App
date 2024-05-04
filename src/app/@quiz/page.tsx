"use client";

import { useEffect, useState } from "react";
import useQuiz from "../store";
import { cn } from "@/lib/utils";

const Quiz = () => {
  const [questions, setQuestions] = useState<any>([]);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const config = useQuiz((state) => state.config);
  const addScore = useQuiz((state) => state.addScore);

  useEffect(() => {
    async function getQuestions() {
      setLoading(true);
      const { results } = await (
        await fetch(
          `https://opentdb.com/api.php?amount=${config.numberOfQuestion}&category=${config.category.id}&difficulty=${config.level}&type=${config.type}`
        )
      ).json();
      let shuffledResults = results.map((e) => {
        let value = [...e.incorrect_answers, e.correct_answer]
          .map((value) => ({ value, sort: Math.random() }))
          .sort((a, b) => a.sort - b.sort)
          .map(({ value }) => value);
        e.answer = [...value];
        return e;
      });
      setQuestions([...shuffledResults]);
      setLoading(false);
    }

    getQuestions();
  }, [config.numberOfQuestion, config.category.id, config.level, config.type]);

  const handleNext = () => {
    let remainingQuestions = [...questions];
    remainingQuestions = remainingQuestions.shift();
    setQuestions([...remainingQuestions]);
    setAnswer("");
  };

  const checkAnswer = (answer: string) => {
    if (answer === questions[0].correct_answer) {
      addScore(0);
    }
    setAnswer(questions[0].correct_answer);
  };

  return (
    <section className="flex flex-col justify-center items-center mt-10">
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        Question Number
        <span className="text-blue-600 dark:text-blue-500"> #1</span>.
      </h1>
      <p className="text-2xl">Score : 0</p>
      <section className="shadow-2xl my-10 p-10 w-[90%] rounded-lg flex flex-col justify-center items-center shadow-blue-200">
        <h4 className="mb-4 text-2xl font-extrabold leading-none tracking-tight text-blue-600 dark:text-blue-500 md:text-3xl lg:text-5xl ">
          {questions.length ? questions[0].question : null}
        </h4>
        <div className="flex justify-evenly items-center my-10 flex-wrap w-[90%]">
          {questions.length
            ? questions[0].answers.map((ans) => (
                <button
                  key={ans}
                  type="button"
                  onClick={() => checkAnswer(ans)}
                  className={cn(
                    "w-[33%] my-4 py-3.5 px-5 me-2 mb-2 text-lg font-medium text-gray-900 focus:outline-none bg-white rounded-lg shadow-blue-200 shadow-2xl border border-gray-200 hover:bg-blue-600 hover:text-gray-100 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700",
                    {
                      "bg-red-900": answer && ans !== answer,
                      "bg-blue-700": answer && ans === answer,
                      "hover:bg-red-900": answer && ans !== answer,
                      "text-gray-100": answer,
                    }
                  )}
                >
                  {ans}
                </button>
              ))
            : null}
        </div>
        <button
          onClick={() => handleNext()}
          type="button"
          className="w-[33%] my-4 py-3.5 px-5 me-2 mb-2 text-lg font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-blue-900 hover:text-gray-100 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        >
          Next
        </button>
      </section>
    </section>
  );
};

export default Quiz;
