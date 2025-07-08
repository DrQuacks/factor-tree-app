interface Props {
  onFullyFactored: () => void;
  onHint: () => void;
  onSolution: () => void;
  hintText?: string;
  showHint?: boolean;
  showSolution?: boolean;
}

export default function ControlButtons({ 
  onFullyFactored, 
  onHint, 
  onSolution,
  hintText = '',
  showHint = false,
  showSolution = false
}: Props) {
  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="flex space-x-3">
        <button 
          className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 transition-colors"
          onClick={onFullyFactored}
        >
          Fully Factored
        </button>
        <button 
          className="bg-yellow-500 text-white px-3 py-1.5 rounded text-sm hover:bg-yellow-600 transition-colors"
          onClick={onHint}
        >
          Hint
        </button>
        <button 
          className="bg-gray-600 text-white px-3 py-1.5 rounded text-sm hover:bg-gray-700 transition-colors"
          onClick={onSolution}
        >
          Solution
        </button>
      </div>
      
      {showHint && hintText && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-3 py-1.5 rounded text-sm">
          {hintText}
        </div>
      )}
      
      {showSolution && (
        <div className="bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded text-sm">
          Complete solution shown
        </div>
      )}
    </div>
  );
}
