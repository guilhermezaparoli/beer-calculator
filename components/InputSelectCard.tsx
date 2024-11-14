import { useState } from "react";


type InputSelectCardProps = {
  suggestions: string[];
  handleVolumeChange: (value: string) => void
  value: string;
} & React.InputHTMLAttributes<HTMLInputElement>;


export function InputSelectCard({ suggestions, handleVolumeChange, onChange, value, ...rest }: InputSelectCardProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleSuggestionClick = (value: string) => {
    setIsFocused(false);
    handleVolumeChange(value)
  };

  return (
    <div className="relative w-full">
      <input
        value={value}
        onChange={onChange}
        onFocus={() => {setIsFocused(true)
          handleVolumeChange(value.replace("ml", ""))

        }}
        onBlur={() => {setTimeout(() => setIsFocused(false), 200)
          handleVolumeChange(value !== "" ? value + "ml" : value)
        }}
        className="bg-gray300 rounded-[4px] p-2 w-full text-white outline-none"
        {...rest}
      />
      {isFocused && (
        <ul className="absolute bg-gray500 w-full rounded-b-[4px] mt-1 z-10 max-h-40 overflow-y-auto">
          {suggestions
            .filter((suggestion) =>
              suggestion.toLowerCase().includes(String(value).toLowerCase())
            )
            .map((suggestion) => (
              <li
                key={suggestion}
                onMouseDown={() => handleSuggestionClick(suggestion)}
                className="p-2 cursor-pointer hover:bg-gray-600 text-white"
              >
                {suggestion}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
