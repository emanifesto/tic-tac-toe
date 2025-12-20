//play through history with setInterval
//map number pad to squares for easier play
/*disappearing inputs 3or4, 
history only display to go back n moves,
*/
//test regular ts files for numpad input event first

import { useState, type ReactElement } from 'react'
import './App.css'

function Status({ turn, player, winner }: {turn: number, player: string, winner: string}){
  let text: ReactElement<Element> = winner ? <>Winner is <strong>{winner}</strong></> : <>Turn {turn}: <strong>{player}</strong></>
  return (
      <section>
        {text}
      </section>
  )
}

function Square({ id, value, handleClick }: {handleClick: Function, id: number, value: string}){
  
  const title: string = value ? `Filled: ${value}`: ""

  return(
    <button className='square' title={title} onClick={() => handleClick(id)}>
        {value}
    </button>
  )
}

function Board({ squares, setSquares, turn, setTurn, player, winner, history, setHistory}: {squares: string[], setSquares: Function, turn: number, setTurn: Function, player: string, winner: string, history: string[][], setHistory: Function}){
  const rows = [0, 3, 6]

  async function handleClick(id: number){
    if (!(squares[id] || winner)){
      const newSquares: string[] = [...squares]
      newSquares[id] = player
      setSquares(newSquares)
      
      const newHistory: string[][] = history.slice(0, turn)
      setHistory(newHistory)

      setTurn(turn + 1)
    }
  }

  return (
    <figure>
      {rows.map((row) => {
        return (
          <div key={`row${Math.floor(row/3)}`} className="board-row">
            {
              squares.slice(row, row + 3).map((value, index) => {
                return (
                  <Square 
                    key={`square${Math.floor(row/3)}-${index}`}
                    id={row + index}
                    value={value}
                    handleClick={handleClick}
                  />
                )
              })
            }
          </div>
        )
      })}
    </figure>
  )
}

function Reset({setSquares, setTurn}:{setSquares:Function, setTurn: Function}){
  return(
    <button onClick={() => {
      setSquares(Array<string>(9).fill(""))
      setTurn(0)
    }}>
      Reset
    </button>
  )
}

function History({ history, setSquares, setTurn }: {history: Array<Array<string>>, setSquares: Function, setTurn: Function}){
  function handleClick(squares: Array<String>, index: number){
    setSquares(squares)
    setTurn(index + 1)
  }
  
  return (
    <ol>
      {history.map((value, index) => {
        return(
          <li key={`history${index}`}>
          {/* //   <HistoryItem id={index} squareState={value} setSquares={setSquares} setTurn={setTurn} /> */}
            <button onClick={() => handleClick(value, index)}>
              {`Return to Turn ${index + 1}`}
            </button>
          </li>
        )
      })}
    </ol>
  )
}

// function HistoryItem({ squareState, setSquares, id, setTurn}: {squareState: string[], setSquares: Function, id: number, setTurn: Function}){
//   function handleClick(){
//     setSquares(squareState)
//     setTurn(id + 1)
//   }

//   return(
//     <button onClick={handleClick}>
//       {`Return to Turn ${id + 1}`}
//     </button>
//   )
// }

export default function Game(){
  const [turn, setTurn]: [number, Function] = useState(0)
  const [squares, setSquares]: [string[], Function] = useState<string[]>(Array<string>(9).fill(''))
  const [history, setHistory]: [string[][], Function] = useState<string[][]>([])
  const player: string = turn % 2 == 0 ? 'X' : 'O'
  function calcWinner(squares: string[]){
    const winConds : Array<Array<number>> = [
      [0, 1, 2], [0, 3, 6], [0, 4, 8],
      [1, 4, 7], [2, 4, 6], [2, 5, 8],
      [3, 4, 5], [6, 7, 8]
    ]

    for (const cond of winConds){
      const [a, b, c] = cond
      if (squares[a] && squares[a] == squares[b] && squares[a] == squares[c]){
        return squares[a]
      }
    }
    return ''
  }
  const winner = calcWinner(squares)

  return (
    <main className="game">
      <section>
        <Status turn={turn} player={player} winner={winner}/>
        <Board
          squares={squares}
          setSquares={setSquares}
          turn={turn}
          setTurn={setTurn}
          player={player}
          winner={winner}
          history={history}
          setHistory={setHistory}
        />
        <Reset setSquares={setSquares} setTurn={setTurn} />
      </section>
      <section>
        <History history={history} setSquares={setSquares} setTurn={setTurn} />
      </section>
    </main>
  )
};