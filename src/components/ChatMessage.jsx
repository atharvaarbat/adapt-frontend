const ChatMessage = ({ text, sender }) => {
    const isUser = sender === 'user';
    
    return (
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
          <p>{text}</p>
        </div>
      </div>
    );
  };
  
  export default ChatMessage;