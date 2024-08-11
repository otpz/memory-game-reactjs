import { useState } from 'react';
import './App.css';
import { Box } from './Types/Box';

const App = () => {

  const [isDetected, setIsDetected] = useState<boolean>(false) 

  const [coolDown, setCoolDown] = useState<boolean>(false)

  const [score, setScore] = useState<number>(0)

  const [miskateScore, setMistakeScore] = useState<number>(0)

  const [memory, setMemory] = useState<Box[]>([])

  const generateRandomMatrix = (): number[][] => {
    // 0-9 arasındaki sayılardan her birini iki kez içeren bir dizi oluştur.
    const numbers = [];
    for (let i = 0; i <= 9; i++) {
        numbers.push(i, i);
    }

    // Diziyi karıştır (Fisher-Yates yöntemi).
    for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    // 4x5 matrisine yerleştir.
    const matrix: number[][] = [];
    for (let i = 0; i < 4; i++) {
        matrix.push(numbers.slice(i * 5, (i + 1) * 5));
    }

    return matrix;
  } 

  const [grid, setGrid] = useState<number[][]>(
    // [
    //   [1,1,0,2,4],
    //   [9,8,3,0,5],
    //   [4,2,7,6,5],
    //   [7,3,9,6,8],
    // ]
    generateRandomMatrix()
  )

  const [revealed, setRevealed] = useState<number[][]>(
    [
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
    ]
  )

  

  const addMemory = (number: number, rowIdx: number, colIdx: number): void => {

    setRevealed(prev => {
      const newRevealed = [...prev]
      newRevealed[rowIdx][colIdx] = 1
      console.log(number)
      return newRevealed
    })

    setMemory(prev => {
      const newMemory = [...prev]

      if (newMemory.length === 1 && newMemory[0].colIdx === colIdx && newMemory[0].rowIdx === rowIdx){
        return newMemory
      }

      newMemory.push({number: number, rowIdx: rowIdx, colIdx: colIdx})
      
      if (newMemory.length === 2){
        if (newMemory[0].number === newMemory[1].number){
          setCoolDown(true)
          setIsDetected(true)
          setTimeout(() => {
            setCoolDown(false)
          }, 1000)
          setScore(prev => prev + 1)
        } else {
          setCoolDown(true)
          setIsDetected(false)
          setTimeout(() => {
            setRevealed(prev => {
              const newRevealed = [...prev]
              newMemory.forEach((box) => {
                newRevealed[box.rowIdx][box.colIdx] = 0
              })
              return newRevealed
            })
            setCoolDown(false)
          }, 1000)
          setMistakeScore(prev => prev + 1)
        }
        return []
      }
      
      return newMemory
    })
  }

  return (
    <div className="container">
      <div className='content'>
        <div className='title'>Memory Game</div>
        <div className='scores'>
          <span className='score'>Score: {score}</span>
          <span className='mistake'>Mistakes: {miskateScore}</span> 
        </div>
        <div className='grid'>
          {
            grid.map((row, rowIdx) => (
              <div key={rowIdx} id={`${rowIdx}`} className="row" style={{userSelect: coolDown ? "none" : "all"}}>
                {
                  row.map((number, colIdx) => (
                    <button key={colIdx} id={`${colIdx}`} onClick={() => addMemory(number, rowIdx, colIdx)} disabled={(revealed[rowIdx][colIdx] ? true : false) || coolDown}  className='box'>{revealed[rowIdx][colIdx] ? number : null}</button>
                  ))
                }
              </div>
            ))
          }
        </div>
        {
        coolDown && 
          <div className='info-message'>
            {isDetected ? <span>Congratulations!</span> : <span>Does not matching!</span>}
          </div>
        }
        {
        score === 10 ? 
          <div className='info-message'>
            Game over 💯
          </div> : null
        }
      </div>
    </div>
  )
}

export default App;
