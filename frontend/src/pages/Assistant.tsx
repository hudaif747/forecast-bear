import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Send, MessageSquare, Calendar, TrendingUp, Search } from "lucide-react";

const quickActions = [
  { label: "Explain Berlin prediction", icon: MessageSquare },
  { label: "December marketing needs", icon: Calendar },
  { label: "November revenue outlook", icon: TrendingUp },
  { label: "Run best-case scenario", icon: Search },
];

const mockConversation = [
  {
    role: "assistant",
    content: "Hello! I'm your forecast assistant. I can help you understand predictions, identify marketing opportunities, and run scenario analyses. What would you like to know?",
  },
];

export default function Assistant() {
  const [messages, setMessages] = useState(mockConversation);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newMessages = [
      ...messages,
      { role: "user", content: input },
      {
        role: "assistant",
        content: `I understand you're asking about: "${input}". This is a demo interface. In production, this would connect to an AI model to provide insights about game forecasts, marketing strategies, and scenario analysis.`,
      },
    ];
    
    setMessages(newMessages);
    setInput("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">AI Forecast Assistant</h2>
        <p className="text-muted-foreground">
          Ask questions about predictions, get marketing recommendations, and explore scenarios
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <Card className="border-border lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Chat with Assistant</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Messages */}
            <div className="space-y-4 min-h-[400px] max-h-[400px] overflow-y-auto pr-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`rounded-lg p-4 max-w-[80%] ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Ask about forecasts, scenarios, or marketing..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                className="flex-1"
              />
              <Button onClick={handleSend} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickActions.map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setInput(action.label)}
                >
                  <action.icon className="h-4 w-4 mr-2" />
                  {action.label}
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">Capabilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Badge variant="secondary" className="mr-2 mb-2">Explain predictions</Badge>
              <Badge variant="secondary" className="mr-2 mb-2">Marketing advice</Badge>
              <Badge variant="secondary" className="mr-2 mb-2">Scenario analysis</Badge>
              <Badge variant="secondary" className="mr-2 mb-2">Revenue insights</Badge>
              <Badge variant="secondary" className="mr-2 mb-2">Risk assessment</Badge>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Example Queries */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg text-foreground">Example Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-foreground font-medium mb-1">
                "Which December games need extra marketing?"
              </p>
              <p className="text-xs text-muted-foreground">
                Get targeted recommendations for underperforming games
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-foreground font-medium mb-1">
                "Explain the Berlin game prediction"
              </p>
              <p className="text-xs text-muted-foreground">
                Understand the factors driving specific forecasts
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-foreground font-medium mb-1">
                "Summarize November revenue outlook"
              </p>
              <p className="text-xs text-muted-foreground">
                Get executive summaries of monthly performance
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-foreground font-medium mb-1">
                "What if we increase prices by 10%?"
              </p>
              <p className="text-xs text-muted-foreground">
                Run what-if scenarios for strategic decisions
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
