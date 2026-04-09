import React, { useState, KeyboardEvent } from "react";
import { SendHorizontal, Paperclip } from "lucide-react";

interface ChatInputProps {
  onSend: (content: string) => void;
}

export function ChatInput({ onSend }: ChatInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (inputValue.trim()) {
      onSend(inputValue.trim());
      setInputValue("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 w-full z-10 sticky bottom-0">
      <div className="flex bg-white border border-gray-200 shadow-sm rounded-full w-full items-center px-3 py-2 focus-within:ring-4 focus-within:ring-[#20B271]/10 focus-within:border-[#20B271]/40 transition-all duration-300">
        <button 
          className="text-gray-400 hover:text-[#20B271] p-2 transition-colors rounded-full hover:bg-[#20B271]/10"
          aria-label="Attach file"
        >
          <Paperclip className="w-5 h-5" />
        </button>
        <input
          type="text"
          className="flex-1 bg-transparent border-none outline-none text-[15px] px-2 placeholder:text-gray-400 text-gray-800 min-w-0"
          placeholder="Type your message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleSend}
          disabled={!inputValue.trim()}
          className="ml-2 bg-[#20B271] text-white rounded-full p-2 w-10 h-10 flex items-center justify-center hover:bg-[#1a925d] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:hover:shadow-none disabled:hover:translate-y-0 disabled:cursor-not-allowed transition-all duration-200"
          aria-label="Send message"
        >
          <SendHorizontal className="w-5 h-5 -ml-0.5" />
        </button>
      </div>
    </div>
  );
}
