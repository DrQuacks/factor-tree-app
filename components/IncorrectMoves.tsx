type Props = {
  count: number;
};

export default function IncorrectMoves({ count }: Props) {
  return (
    <div className="bg-red-50 text-red-700 px-4 py-2 rounded text-sm border border-red-200">
      Incorrect: {count}
    </div>
  );
}
