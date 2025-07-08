type Props = {
  count: number;
};

export default function IncorrectMoves({ count }: Props) {
  return (
    <div className="bg-red-50 text-red-700 px-3 py-1.5 rounded text-sm border border-red-200">
      Incorrect: {count}
    </div>
  );
}
