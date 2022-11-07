import React, { useState } from 'react'

type Square = 'X' | 'O' | ' '
type Row = [Square, Square, Square]
type Board = [Row, Row, Row]
type Game = {
  board: Board
  id: null | number
  winner: null | string
}

export function App() {
  const [game, setGame] = useState<Game>({
    board: [
      [' ', ' ', ' '],
      [' ', ' ', ' '],
      [' ', ' ', ' '],
    ],
    id: null,
    winner: null,
  })

  async function handleClickCell(row: Number, column: number) {
    if (game.id === null || game.winner || game.board[row][column] !== ' ') {
      return
    }
    const url = `https://sdg-tic-tac-toe-api.herokuapp.com/game/${game.id}`

    const body = { row, column }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (response.ok) {
      const newGameState = (await response.json()) as Game

      setGame(newGameState)
    }
  }

  async function handleNewGame() {
    const response = await fetch(
      'https://sdg-tic-tac-toe-api.herokuapp.com/game',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
      }
    )

    if (response.ok) {
      const newGameState = (await response.json()) as Game

      setGame(newGameState)
    }
  }

  const header = game.winner ? `${game.winner} is the winner` : 'Tic Tac Toe'

  return (
    <div>
      <h1>
        {header} - {game.id}
        <button onClick={handleNewGame}>New</button>
      </h1>
      <ul>
        {game.board.map(function (row, rowIndex) {
          return row.map(function (column, columnIndex) {
            return (
              <li
                key={columnIndex}
                className={column === ' ' ? undefined : 'taken'}
                onClick={() => handleClickCell(rowIndex, columnIndex)}
              >
                {game.board[rowIndex][columnIndex]}
              </li>
            )
          })
        })}
      </ul>
    </div>
  )
}
