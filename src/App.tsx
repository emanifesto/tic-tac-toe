//play through history with setInterval
//map number pad to squares for easier play
/*disappearing inputs 3or4, 
history only display to go back n moves,
*/
import { useState, type ReactElement } from 'react'
import './App.css'

function Square({ player, squareClick }: {squareClick: any, player: string}){
  const title: string = player ? `Filled: ${player}`: ""

  return(
    <button className='square' title={title} onClick={squareClick}>
        {player}
    </button>
  )
}

function Board({ squares, squareClick }: {squares: string[], squareClick: Function}){
  const rows: number[] = [0, 1, 2]

  const createRow: Function = (row: number) => {
    const startCol: number = row * 3
    const endCol: number = startCol + 3

    return(
      squares.slice(startCol, endCol).map((player, index) => {
        return (
          <Square 
            key={`S${row}-${index}`}
            player={player}
            squareClick={()  => squareClick(startCol + index)}
          />
        )
      })
    )
  }

  return (
    <figure>
      {rows.map((row) => {
        return (
          <div key={`R${row}`} className="board-row">
            {createRow(row)}
          </div>
        )
      })}
    </figure>
  )
}

function Options({ historyClick, replayMoves }: {historyClick:Function, replayMoves: Function}){
  return(
    <div className="options">
      <button onClick={() => historyClick(Array<string>(9).fill(''), -1)}>
        Reset
      </button>
      <button onClick={() => replayMoves()}>
        Replay
      </button>
    </div>
  )
}

function History({ history, historyClick}: {history: string[][], historyClick: Function}){
  return (
    <ol>
      {history.map((value, index) => {
        const text: string = `Return to Turn ${index + 1}`
        return(
          <li key={`H${index}`}>
            <button onClick={() => historyClick(value, index)}>{text}</button>
          </li>
        )
      })}
    </ol>
  )
}

export default function Game(){
  const [turn, setTurn]: [number, Function] = useState(0)
  const [squares, setSquares]: [string[], Function] = useState<string[]>(Array<string>(9).fill(''))
  const [history, setHistory]: [string[][], Function] = useState<string[][]>([])
  const player: string = turn % 2 == 0 ? 'X' : 'O'
  const winner: string = calcWinner(squares)
  const lock = inputLock

  const statusText: ReactElement<Element> = winner ? <>Winner is <strong>{winner}</strong></> : <>Turn {turn}: <strong>{player}</strong></>

  function squareClick(id: number){
    if (squares[id] || winner || lock.inputDisabled)
      return

    const newSquares: string[] = [...squares]
    newSquares[id] = player
    setSquares(newSquares)
    
    const newHistory: string[][] = history.slice(0, turn)
    newHistory.push(newSquares)
    setHistory(newHistory)

    setTurn(turn + 1)
  }

  function historyClick(squares: Array<String>, index: number){
    if (lock.inputDisabled)
      return
    setSquares(squares)
    setTurn(index + 1)
  }

  function replayMoves(){
    if (history.length){
      lock.disableInput()

      setSquares(Array<string>(9).fill(''))
      let current: number = 0
      const end: number = history.length

      const replayInterval = setInterval(() => {
        if (current == end){
          clearInterval(replayInterval)
          lock.enableInput()
          return
        }

        setSquares(history[current])
        current++
      }, 600)
    }
  }

  return (
    <main className="game">
      <section>
        <section className="status">{statusText}</section>
        <Board squares={squares} squareClick={squareClick} />
        <Options historyClick={historyClick} replayMoves={replayMoves} />
      </section>
      <section>
        <History history={history} historyClick={historyClick} />
      </section>
    </main>
  )
}

function calcWinner(squares: string[]): string{
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

interface inputLock{
  inputDisabled: boolean
  enableInput: Function
  disableInput: Function
}
const inputLock: inputLock = {
  inputDisabled: false,
  enableInput():void{this.inputDisabled = false},
  disableInput(): void{this.inputDisabled = true},
}