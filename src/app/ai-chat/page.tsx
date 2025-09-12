"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { sendMessage } from "./actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, Send, User, Sparkles, MessageCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
  id: string;
  timestamp: Date;
}

const TypingIndicator = () => (
  <div className="flex items-center gap-1 px-2 py-1">
    <div className="flex items-center space-x-1">
      <div className="h-2 w-2 bg-foreground/50 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="h-2 w-2 bg-foreground/50 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="h-2 w-2 bg-foreground/50 rounded-full animate-bounce"></div>
    </div>
    <span className="text-xs text-muted-foreground ml-2">Dhadhi is typing...</span>
  </div>
);

const MessageBubble = ({ message, index }: { message: Message; index: number }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div
      className={cn(
        "flex items-start gap-3 max-w-[85%] transition-all duration-500 ease-out",
        message.role === "user" && "ml-auto flex-row-reverse",
        isVisible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-4"
      )}
    >
      <Avatar className={cn(
        "h-9 w-9 shrink-0 shadow-sm transition-all duration-300 hover:scale-110",
        message.role === "assistant" 
          ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white" 
          : "bg-gradient-to-br from-green-500 to-blue-500 text-white"
      )}>
        <AvatarFallback className="bg-transparent">
          {message.role === "assistant" ? (
            <Bot className="h-4 w-4" />
          ) : (
            <User className="h-4 w-4" />
          )}
        </AvatarFallback>
      </Avatar>
      <div
        className={cn(
          "rounded-2xl px-4 py-3 prose prose-sm max-w-none shadow-sm transition-all duration-300 hover:shadow-md group relative",
          message.role === "user"
            ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-br-sm"
            : "bg-gradient-to-br from-muted to-muted/50 rounded-bl-sm border border-border/50"
        )}
      >
        <p className={cn(
          "m-0 leading-relaxed transition-all duration-200",
          message.role === "user" ? "text-primary-foreground" : "text-foreground"
        )}>
          {message.content}
        </p>
        <div className={cn(
          "text-xs mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200",
          message.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
        )}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-4">
    <div className="relative">
      <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
        <Sparkles className="h-8 w-8 text-white" />
      </div>
      <div className="absolute -top-1 -right-1 h-6 w-6 bg-green-500 rounded-full flex items-center justify-center">
        <MessageCircle className="h-3 w-3 text-white" />
      </div>
    </div>
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-foreground">Welcome to Dhadhi</h3>
      <p className="text-muted-foreground max-w-md">
        Your intelligent health assistant is ready to help. Ask me anything about health, 
        symptoms, medications, or general wellness questions.
      </p>
    </div>
    <div className="flex flex-wrap gap-2 justify-center max-w-md">
      {[
        "Check symptoms",
        "Ask about medications",
        "Health tips",
        "Mental wellness"
      ].map((suggestion, index) => (
        <div
          key={index}
          className="px-3 py-1 bg-muted rounded-full text-xs text-muted-foreground border border-border/50 hover:bg-muted/80 transition-colors duration-200 cursor-pointer"
        >
          {suggestion}
        </div>
      ))}
    </div>
  </div>
);

export default function AiChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { 
      role: "user", 
      content: input,
      id: generateId(),
      timestamp: new Date()
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const result = await sendMessage(input);
      const assistantMessage: Message = {
        role: "assistant",
        content: result.response,
        id: generateId(),
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: "assistant",
        content: "I apologize, but I'm experiencing some technical difficulties. Please try again in a moment.",
        id: generateId(),
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <div className="flex h-[calc(100vh-6rem)] flex-col w-full p-4 sm:p-6 lg:p-8 force-full-width">
      <PageHeader
        title="AI Chat"
        description="Your intelligent health assistant powered by advanced AI technology."
      />
      
      <Card className="mt-4 flex flex-1 flex-col min-h-0 shadow-lg border-border/50 transition-all duration-300 hover:shadow-xl">
        <CardHeader className="border-b border-border/50 py-4 bg-gradient-to-r from-muted/30 to-transparent">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            <h3 className="text-lg font-semibold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Chat Session
            </h3>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-hidden p-0 relative">
          <ScrollArea className="h-full" ref={scrollAreaRef}>
            {messages.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="space-y-4 p-4 sm:p-6">
                {messages.map((message, index) => (
                  <MessageBubble key={message.id} message={message} index={index} />
                ))}
                {isLoading && (
                  <div className="flex items-start gap-3 max-w-[85%] animate-in slide-in-from-bottom-4 duration-300">
                    <Avatar className="h-9 w-9 shrink-0 bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-sm">
                      <AvatarFallback className="bg-transparent">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-gradient-to-br from-muted to-muted/50 rounded-2xl rounded-bl-sm px-4 py-3 border border-border/50 shadow-sm">
                      <TypingIndicator />
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </CardContent>
        
        <CardFooter className="border-t border-border/50 pt-4 pb-4 bg-gradient-to-r from-muted/20 to-transparent">
          <form onSubmit={handleSubmit} className="flex w-full gap-3">
            <div className="relative flex-1">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about health and wellness..."
                disabled={isLoading}
                className="pr-12 border-border/50 focus:border-primary/50 transition-all duration-200 bg-background/50 backdrop-blur-sm"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <MessageCircle className="h-4 w-4" />
              </div>
            </div>
            <Button 
              type="submit" 
              disabled={isLoading || !input.trim()} 
              size="icon" 
              className="shrink-0 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
            >
              <Send className={cn(
                "h-4 w-4 transition-transform duration-200",
                isLoading && "scale-0",
                !isLoading && input.trim() && "scale-100",
                !input.trim() && "scale-75 opacity-50"
              )} />
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
