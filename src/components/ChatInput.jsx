import { ArrowRight } from 'lucide-react';
import { useState } from 'react';

const ChatInput = ({ onSend, disabled }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Type your message..."
        disabled={disabled}
      />
      <button
        type="submit"
        className="px-4 py-2 flex items-center bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        disabled={!message.trim() || disabled}
      >
        Send
        <ArrowRight className="w-4 h-4 ml-2" />
      </button>
    </form>
  );
};

export default ChatInput;