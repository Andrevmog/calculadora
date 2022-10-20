import React, { useEffect, useState } from "react";
import "./Calculadora.scss";

export default function Calculator() {
  const [showDisplay, setShowDisplay] = useState<string>("0");
  const [operator, setOperator] = useState<string>("");

  /* Usando RegEx para poder calcular mais de 2 numeros por vez */
  const regexZeroPoint = /^[0]\./;
  const regexZeroStart = /^[0]/;
  const regexNumber = /^\d+$/;
  const regexOperators = /(^[+\-/×÷%]+)/;
  const regexValidKeys = /(^[0-9$+\-/*%,.]+)/;

  let lastChar: string = "";

  /* Limpa o Display e mostra valor 0 */
  function clearDisplay() {
    setShowDisplay("0");
  }

  /* Muda para positivo ou negativo o valor */
  function toggleValue() {
    const newValue = parseFloat(showDisplay) * -1;
    setShowDisplay(String(newValue));
  }

  /* Calculo e replace para efetuar*/
  function calcParse(e: string) {
    if (showDisplay.length > 0 && operator !== "result") {
      const parseValue = e.replace("×", "*").replace("÷", "/").replace("=", "");
      setOperator("result");
      return new Function(`return (${parseValue})`)();
    } else {
      return showDisplay;
    }
  }

  /* Função para controle do Array */
  function readKeyOrClick(key: any) {
    if (operator === "result" && regexOperators.test(key) && lastChar != key) {
      setOperator("");
      return setShowDisplay(`${showDisplay}${key}`);
    } else if (operator === "result" && regexNumber.test(showDisplay)) {
      setOperator("");
      return setShowDisplay(key);
    } else if (
      regexZeroStart.test(showDisplay) &&
      !regexZeroPoint.test(showDisplay)
    ) {
      return setShowDisplay(key);
    } else if (regexOperators.test(key) && lastChar === key) {
      return setShowDisplay(`${showDisplay}`);
    } else if (regexOperators.test(key) && regexOperators.test(lastChar)) {
      return setShowDisplay(`${showDisplay.slice(0, -1)}${key}`);
    } else {
      return setShowDisplay(`${showDisplay}${key}`);
    }
  }

  /* Monstra os valores no display e adiciona no Array */
  const calculatorKey = (e: string) => {
    if (showDisplay.length > 0) {
      lastChar = showDisplay.charAt(showDisplay.length - 1);
    }
    readKeyOrClick(e);
  };

  useEffect(() => {
    /* Roda cada vez que uma tecla é apertada para atualizar o Array */
    function handleSetSelected(e: any) {
      let key: string = e.key;

      if (showDisplay.length > 0) {
        lastChar = showDisplay.charAt(showDisplay.length - 1);
      }

      /* Se a tecla for de resultado, irá calcular. Vê se a tecla do enter para acionar o resultado também */
      if (regexValidKeys.test(key) && key != "enter") {
        key = key.replace("*", "×").replace("/", "÷").replace(",", ".");
        readKeyOrClick(key);
      } else if (key === "Enter" || key === "NumNumpadEnter") {
        const res = calcParse(showDisplay);
        setShowDisplay(res);
      }
    }
    window.addEventListener("keydown", handleSetSelected);
    return () => {
      window.removeEventListener("keydown", handleSetSelected);
    };
  }, [showDisplay, operator]);

  return (
    <div className="calculator">
      <div>
        <div className="calculator-wrapper">
          <div className="calculator-display">
            <input
              type="text"
              className="display"
              value={String(showDisplay).slice(0, 10)}
              disabled
            />
          </div>
          <div className="keys">
            <div className="calculator-buttons">
              <input className="calculator-button operator top" type="button" value="AC" onClick={() => clearDisplay()} />
              <input className="calculator-button operator top" type="button" value="±" onClick={() => toggleValue()} />
            </div>
            <div className="calculator-buttons">
            <input className="calculator-button" type="button" value="1" onClick={() => calculatorKey("1")} />
              <input className="calculator-button" type="button" value="2" onClick={() => calculatorKey("2")} />
              <input className="calculator-button" type="button" value="3" onClick={() => calculatorKey("3")} />
              <input className="calculator-button operator" type="button" value="÷" onClick={() => calculatorKey("÷")} />
            </div>
            <div className="calculator-buttons">
              <input className="calculator-button" type="button" value="4" onClick={() => calculatorKey("4")} />
              <input className="calculator-button" type="button" value="5" onClick={() => calculatorKey("5")} />
              <input className="calculator-button" type="button" value="6" onClick={() => calculatorKey("6")} />
              <input className="calculator-button operator" type="button" value="×" onClick={() => calculatorKey("×")} />
            </div>
            <div className="calculator-buttons">
            <input className="calculator-button" type="button" value="7" onClick={() => calculatorKey("7")} />
              <input className="calculator-button" type="button" value="8" onClick={() => calculatorKey("8")} />
              <input className="calculator-button" type="button" value="9" onClick={() => calculatorKey("9")} />
              <input className="calculator-button operator" type="button" value="-" onClick={() => calculatorKey("-")} />
            </div>
            <div className="calculator-buttons">
              <input className="calculator-button operator" type="button" value="." onClick={() => calculatorKey(".")} />
              <input className="calculator-button" type="button" value="0" onClick={() => calculatorKey("0")} />
              <input className="calculator-button operator" type="button" value="+" onClick={() => calculatorKey("+")} />
              <input
                type="button"
                value="="
                className=" calculator-button equal operator"
                onClick={() => setShowDisplay(calcParse(showDisplay))}
              />   
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
