import { useState } from "react";
import { allDice, Die } from './Die';
export type Value = 'X' | 'O' | null;


export type BoardState = Value[];
const createBoardState = () => Array<Value>(9).fill(null);

function calculateWinner(boardState: BoardState) {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < winningCombinations.length; i++) {
    const [a, b, c] = winningCombinations[i];
    if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
      return boardState[a];
    }
  }
  return null;
}

export type GameState = {
  history: BoardState[],
  step: number,
}

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>({
    history: [createBoardState()],
    step: 0,
  });

  const current = gameState.history[gameState.step];
  const xIsNext = (gameState.step % 2) === 0;
  const winner = calculateWinner(current);

  function handleClick(square: number) {
    const history = gameState.history.slice(0, gameState.step + 1);
    const boardState = history[history.length - 1];
    if (calculateWinner(boardState) || boardState[square]) {
      return;
    }
    const newBoardState = boardState.slice();
    newBoardState[square] = (gameState.step % 2) === 0 ? 'X' : 'O';
    history.push(newBoardState);
    setGameState({
      history: history,
      step: history.length - 1,
    });
  }
  function jumpTo(step: number) {
    setGameState({
      history: gameState.history,
      step,
    });
  }
  
  return {
    gameState,
    current,
    xIsNext,
    winner,
    handleClick,
    jumpTo
  };
}

export function useDicearooState() {
  var Dice = allDice();
  const [currentDie, setCurrentDie] = useState<Die>(Dice[0]);
  const [message, setMessage] = useState<string>("Roll the die");
  const [points, setPoints] = useState<number>(0);
  const [buttonText, setButtonText] = useState<string>("Roll!")
  const [win, setEnd] = useState<Boolean>(false);
  const [textColor, setTextColor] = useState<string>("black");

  function rollDie(die: Die) {
    var result = Math.floor(Math.random()*10);
    console.log(result);
    switch(true) {
      case result < 1:
        return lose();
        break;
      case result < 3:
        return upgrade();
        break;
      case result < 7:
        return gainPoints();
        break;
      case result < 10:
        return losePoints();
        break;
      default:
        return gainPoints();
    }
  };

  function lose() {
    setButtonText('Try Again!');
    setMessage(`Oh no, you lost!`);
    setEnd(true);
    return;
  }

  function gainPoints() {
    let min = Math.ceil(currentDie.winRange[0]);
    let max = Math.floor(currentDie.winRange[1]);
    let newPoints = Math.floor(Math.random() * (max - min) + min);
    setMessage(`You gain ${newPoints} points!`);
    setTextColor("green");
    setPoints(points + newPoints);
  };

  function losePoints() {
    let min = Math.ceil(currentDie.winRange[0]);
    let max = Math.floor(currentDie.winRange[1]);
    let newPoints = Math.floor(Math.random() * (max - min) + min);
    if ((points - newPoints) <= 0) {
      setMessage(`You lost ${newPoints} points! Don't worry, you can't go below zero!`);
      setTextColor("red");
      setPoints(0);
      return;
    }
    setMessage(`You lost ${newPoints} points!`);
    setPoints(points - newPoints);
  };

  function upgrade() {
    var currentDieColor: string = currentDie.color;
    var dieIds: string[] = Dice.map(function(aDie) {return aDie.color});
    var newDieIndex = dieIds.indexOf(currentDieColor) + 1;
    if (newDieIndex >= Dice.length) {
      setButtonText('Start Over!');
      setTextColor("green");
      setMessage(`You win!`);
      setEnd(true);
      return;
    }
    var newDie = Dice[newDieIndex];
    setMessage(`You move on to the ${Dice[newDieIndex].color} die!`);
    setTextColor("blue");
    setCurrentDie(newDie);
  };

  function reset() {
    setCurrentDie(Dice[0]);
    setMessage("Roll the dice!");
    setPoints(0);
    setButtonText("Roll!");
    setEnd(false);
  };

  function handleClick() {
    setTextColor("black");
    if (win) {
      return reset();
    }
    return rollDie(currentDie);
  };

  return {
    textColor,
    buttonText,
    currentDie,
    message,
    points,
    handleClick
  };
}