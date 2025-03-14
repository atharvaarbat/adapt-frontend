
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw, MessageSquare } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface ActionButtonsProps {
  onClearChat: () => void;
  onDownloadRoute: () => void;
  onFeedback: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onClearChat,
  onDownloadRoute,
  onFeedback,
}) => {
  const handleDownload = () => {
    onDownloadRoute();
    toast({
      title: "Route Download Started",
      description: "Your route information is being prepared for download.",
    });
  };

  const handleFeedback = () => {
    onFeedback();
    toast({
      title: "Feedback",
      description: "Thank you for your feedback! It helps us improve.",
    });
  };

  return (
    <div className="flex gap-2 justify-center md:justify-start">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onClearChat}
        className="flex items-center gap-1 bg-white border-convoy-lightGray text-convoy-darkGray hover:bg-convoy-lightGray/10"
      >
        <RefreshCw className="w-4 h-4" />
        <span className="hidden sm:inline">Clear Chat</span>
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleDownload}
        className="flex items-center gap-1 bg-white border-convoy-lightGray text-convoy-darkGray hover:bg-convoy-lightGray/10"
      >
        <Download className="w-4 h-4" />
        <span className="hidden sm:inline">Download Route</span>
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleFeedback}
        className="flex items-center gap-1 bg-white border-convoy-lightGray text-convoy-darkGray hover:bg-convoy-lightGray/10"
      >
        <MessageSquare className="w-4 h-4" />
        <span className="hidden sm:inline">Feedback</span>
      </Button>
    </div>
  );
};

export default ActionButtons;
