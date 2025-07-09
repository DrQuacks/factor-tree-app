import IncorrectMoves from "./IncorrectMoves";

const Footer = ({ 
    handleHint, 
    handleSolution, 
    handleFullyFactored, 
    incorrectMoves,
    handleNewGame 
  }:{
    handleHint: () => void, 
    handleSolution: () => void, 
    handleFullyFactored: () => void, 
    incorrectMoves: number,
    handleNewGame: () => void
  }) => {    
    return (
      <div className="p-4 bg-white border-t border-gray-200" style={{ backgroundColor: '#FCF9F2' }}>
        <div 
          className="flex mb-3"
          style={{
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%'
          }}
        >
          {/* Left */}
          <div className="flex gap-4">
            <button 
              className="text-white px-4 py-2 rounded "
              onClick={handleHint}
              style={{ backgroundColor: '#008379' }}
            >
              Hint
            </button>
            <button 
              className="px-4 py-2 rounded transition-colors"
              style={{
                backgroundColor: '#DB8C9B',
                color: '#000000'
              }}
              onClick={handleSolution}
            >
              Solution
            </button>
          </div>
          {/* Center */}
          <button 
            className="text-white px-4 py-2 rounded"
            onClick={handleFullyFactored}
            style={{ backgroundColor: '#376783' }}
          >
            Fully Factored
          </button>
          {/* Right */}
          <div className="flex items-center gap-4">
            <IncorrectMoves count={incorrectMoves} />
            <button 
              className="px-4 py-2 rounded transition-colors"
              style={{
                backgroundColor: '#008379',
                color: '#ffffff'
              }}
              onClick={handleNewGame}
            >
              New Game
            </button>
          </div>
        </div>
        <div className="text-center text-gray-500 text-sm mt-3">
          Click on numbers to factor them, or click "Fully Factored" when you think a number is prime.
        </div>
      </div>
    );
  };
  
  export default Footer;