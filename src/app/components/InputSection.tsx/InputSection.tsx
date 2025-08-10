interface Props {
  question: string;
  setQuestion: (val: string) => void;
  onSearch: () => void;
  disabled: boolean;
}

export function InputSection({
  question,
  setQuestion,
  onSearch,
  disabled,
}: Props) {
  return (
    <div className="flex flex-col gap-4 items-start">
      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="A few keywords for your scenario"
        className="w-full border px-3 py-2 rounded"
      />
      <button
        onClick={onSearch}
        disabled={disabled}
        className="px-4 py-2 rounded"
      >
        Submit
      </button>
    </div>
  );
}
