import * as React from 'react';
import { useGameState, useDicearooState } from './GameState'
import Button from '../button';

function Game() {
  const {
    textColor,
    buttonText,
    currentDie,
    message,
    points,
    handleClick
  } = useDicearooState();
  return(
    <>
    <div>You are using the <span className={currentDie.color}>{currentDie.color}</span> die.</div>
    <div className={textColor}>{message}</div>
    <div>You have {points} points</div>
    <Button onClick={handleClick} text={buttonText}></Button>
    </>
  )
}

export default Game;