window.onload = selectElements();

function selectElements() {
  document
    .getElementById("age-calculator__calculate")
    .addEventListener("click", calculateAge);
}

function calculateAge() {
  const inputsDate = document.querySelectorAll(".age-calculator > input");
  const currentDate = new Date();
  const [inputErrors, areErrors] = checkDate(inputsDate, currentDate);

  showErrors(inputErrors, areErrors);

  if (!areErrors) {
    const userDate = new Date(
      inputsDate[2].value,
      inputsDate[1].value - 1,
      inputsDate[0].value
    );
    const age = determinateteAge(new Date(currentDate - userDate));

    showAge(age);
  }
}

function showErrors(inputErrors, areErrors) {
  inputErrors.forEach((error) => {
    const errorMessage = document.getElementById(`${error.id}__error`);
    const inputIsValid = !error.message;

    document
      .querySelector(`label[for="${error.id}"]`)
      .setAttribute("data-is-valid", inputIsValid);
    errorMessage.setAttribute("aria-hidden", inputIsValid);
    document
      .getElementById(error.id)
      .setAttribute("data-is-valid", inputIsValid);
  });

  if (areErrors) {
    document.querySelectorAll(".age-result span").forEach((element) => {
      element.innerHTML = "--";
    });
  }
}

function showAge(age) {
  document.getElementById("age-result__year").innerHTML = age[0];
  document.getElementById("age-result__month").innerHTML = age[1];
  document.getElementById("age-result__day").innerHTML = age[2];
}

function determinateteAge(date) {
  const years = date.toISOString().slice(0, 4) - 1970;
  const months = date.getMonth();
  const days = date.getDate();

  return [years, months, days];
}

function isLeapYear(year) {
  if ((year & 3) == 0 && (year % 25 != 0 || (year & 15) == 0)) {
    return true;
  }
}

function checkDate(inputsDate, currentDate) {
  const currentYear = currentDate.getFullYear();
  const isLeap = isLeapYear(inputsDate[2].value);
  const inputDate = new Date(
    inputsDate[2].value,
    inputsDate[1].value - 1,
    inputsDate[0].value
  );

  const isDatePastCurrent = currentDate < inputDate ? true : false;

  let inputErrors = [];
  let areErrors = false;
  const dateConditions = [
    { date: "day", moreThan: 31, errorMessage: "must be a valid day" },
    { date: "month", moreThan: 12, errorMessage: "must be a valid month" },
    {
      date: "year",
      moreThan: currentYear,
      errorMessage: "must be a valid year",
    },
  ];

  for (let i = 0; i < inputsDate.length; i++) {
    if (!inputsDate[i].value) {
      inputErrors.push({
        id: inputsDate[i].id,
        message: "The field is required",
      });
      areErrors = true;
    } else {
      for (let x = 0; x < dateConditions.length; x++) {
        if (inputsDate[i].name === dateConditions[x].date) {
          if (
            (inputsDate[i].name === "day" &&
              ((inputsDate[1].value == 2 && inputsDate[i].value > 29) ||
                (inputsDate[1].value == 2 &&
                  inputsDate[i].value > 28 &&
                  !isLeap) ||
                (inputsDate[1].value % 2 === 0 && inputsDate[i].value > 30))) ||
            (inputsDate[i].name === "year" && isDatePastCurrent) ||
            inputsDate[i].value < 1 ||
            inputsDate[i].value > dateConditions[x].moreThan
          ) {
            inputErrors.push({
              id: inputsDate[i].id,
              message: dateConditions[x].errorMessage,
            });

            areErrors = true;
          }
        }
      }
    }

    if (!inputErrors[i]) {
      inputErrors.push({
        id: inputsDate[i].id,
        message: "",
      });
    }
  }

  return [inputErrors, areErrors];
}
