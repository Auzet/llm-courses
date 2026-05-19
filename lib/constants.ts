export const test = {
    questions: [
    {
      id: 1,
      question: "Which statement about the geography of Great Britain is TRUE?",
      options: [
        "The highest mountain peak, Ben Nevis, is located in Wales",
        "The longest river in Great Britain is the Thames",
        "Great Britain has a mild climate that is never too hot in summer or too cold in winter",
        "The surface of Scotland and Wales is flat, while England is mountainous"
      ],
      correct_answer: "England, Scotland, Wales, and Northern Ireland",
      explanation: "According to the text: \"The United Kingdom is made up of the countries of England, Scotland, Wales and Northern Ireland. Its full name is the United Kingdom of Great Britain and Northern Ireland.\""
    },
    {
      id: 2,
      question: "What is the governmental structure of the United Kingdom?",
      options: [
        "A federal republic with a president as head of state",
        "A parliamentary monarchy with a bicameral parliament consisting of the House of Lords and House of Commons",
        "A constitutional monarchy with a unicameral parliament",
        "A presidential democracy with three branches of government"
      ],
      correct_answer: "A parliamentary monarchy with a bicameral parliament consisting of the House of Lords and House of Commons",
      explanation: "The text clearly states: \"The United Kingdom is a parliamentary monarchy. British Parliament consists of two Houses: the House of Lords and the House of Commons.\""
    },
    {
      id: 3,
      question: "В каком порядке будут выполнены микрозадачи и макрозадачи, если в очереди находятся и те, и другие?",
      options: [
        "Макрозадачи выполняются первыми",
        "Микрозадачи выполняются первыми",
        "Они выполняются параллельно",
        "Порядок зависит от браузера"
      ],
      correct_answer: "Микрозадачи выполняются первыми",
      explanation: "Event Loop всегда сначала обрабатывает всю очередь микрозадач (Promises, queueMicrotask), и только затем переходит к макрозадачам (setTimeout, setInterval, I/O)."
    },
    {
      id: 4,
      question: "Какой метод используется для преобразования массива промисов в один промис, который разрешается, когда все входные промисы выполнены?",
      options: [
        "Promise.race()",
        "Promise.allSettled()",
        "Promise.all()",
        "Promise.any()"
      ],
      correct_answer: "Promise.all()",
      explanation: "Promise.all() возвращает промис, который успешно завершается массивом результатов, когда все переданные промисы разрешаются. Если хотя бы один отклоняется, весь Promise.all() отклоняется."
    },
    {
      id: 5,
      question: "Что произойдёт, если внутри async-функции произойдёт ошибка, но она не обработана через try/catch?",
      options: [
        "Приложение завершится с ошибкой",
        "Функция вернёт rejected Promise",
        "Ошибка будет проигнорирована",
        "Браузер перезагрузится"
      ],
      correct_answer: "Функция вернёт rejected Promise",
      explanation: "Async-функции автоматически оборачивают синхронные ошибки и выброшенные исключения в rejected Promise. Это позволяет обрабатывать их через `.catch()` или `try/catch` при вызове с `await`."
    },]
  }