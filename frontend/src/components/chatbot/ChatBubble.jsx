import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';

const ChatBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'system', content: 'Hello! I\'m your TripMate Assistant. How can I help plan your Sri Lankan adventure?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleChat = () => setIsOpen(!isOpen);



    // Add user message
    const handleSendMessage = async (e) => {
      e.preventDefault();
      if (!input.trim()) return;
    
      // Store user message before resetting input
      const userMessage = { role: 'user', content: input };
      const messageContent = input.trim(); // Store for API processing
      
      // Add user message to state
      setMessages(prev => [...prev, userMessage]);
      setInput('');
      setIsLoading(true);
    
      try {
        // Here you would integrate with your AI backend
        // This is a placeholder response
        setTimeout(() => {
          const aiResponse = { 
            role: 'system', 
            content: `Thanks for your message about "${messageContent}". I'm your TripMate assistant and would be happy to help with information about Sri Lanka's destinations and travel tips.`
          };
          setMessages(prev => [...prev, aiResponse]);
          setIsLoading(false);
        }, 1000);

      
      // Replace the above with your actual API call:
      // const response = await fetch('/api/chat', {
      //   method: 'POST',
      //   body: JSON.stringify({ message: input }),
      //   headers: { 'Content-Type': 'application/json' }
      // });
      // const data = await response.json();
      // setMessages(prev => [...prev, { role: 'system', content: data.reply }]);
      
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { 
        role: 'system', 
        content: 'Sorry, I encountered an error. Please try again later.' 
      }]);
      setIsLoading(false);
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Chat button */}
      <Button 
        onClick={toggleChat}
        className={`rounded-full shadow-lg h-14 w-14 ${isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </Button>

      {/* Chat window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 h-96 bg-white rounded-lg shadow-xl flex flex-col overflow-hidden border border-gray-200">
          {/* Chat header */}
          <div className="bg-blue-500 text-white px-4 py-3 flex justify-between items-center">
            <h3 className="font-medium">TripMate Assistant</h3>
            <Button variant="ghost" size="icon" onClick={toggleChat} className="text-white hover:bg-blue-600 rounded-full h-8 w-8 p-1">
              <X size={16} />
            </Button>
          </div>
          
          {/* Messages area */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {messages.map((message, idx) => (
              <div 
                key={idx} 
                className={`mb-3 ${
                  message.role === 'user' 
                    ? 'text-right' 
                    : 'text-left'
                }`}
              >
                <div 
                  className={`inline-block rounded-lg px-4 py-2 max-w-[80%] ${
                    message.role === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="text-left mb-3">
                <div className="inline-block rounded-lg px-4 py-2 bg-gray-200 text-gray-800">
                  <div className="flex items-center">
                    <Loader2 size={16} className="animate-spin mr-2" />
                    <span>Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input area */}
          <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-3 flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Send size={18} />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBubble;