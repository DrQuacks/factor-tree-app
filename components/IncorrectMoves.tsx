type Props = {
  count: number;
};

export default function IncorrectMoves({ count }: Props) {
  return (
    <div 
      className="px-4 py-2 rounded text-sm border border-red-200"
      style={{
        backgroundColor: '#F2D8D3',
        color: '#DA4A00'
      }}
    >
      Incorrect: {count}
    </div>
  );
}
