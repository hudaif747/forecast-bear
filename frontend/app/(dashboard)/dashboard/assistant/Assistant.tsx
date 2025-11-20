"use client";

import {
  Calendar,
  MessageSquare,
  Search,
  Send,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const quickActions = [
  { label: "Explain Berlin prediction", icon: MessageSquare },
  { label: "December marketing needs", icon: Calendar },
  { label: "November revenue outlook", icon: TrendingUp },
  { label: "Run best-case scenario", icon: Search },
];

const mockConversation = [
  {
    role: "assistant",
    content:
      "Hello! I'm your forecast assistant. I can help you understand predictions, identify marketing opportunities, and run scenario analyses. What would you like to know?",
  },
];

export default function Assistant() {
  const [messages, setMessages] = useState(mockConversation);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) {
      return;
    }

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
        <h2 className="mb-2 font-bold text-2xl text-foreground">
          AI Forecast Assistant
        </h2>
        <p className="text-muted-foreground">
          Ask questions about predictions, get marketing recommendations, and
          explore scenarios
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Chat Interface */}
        <Card className="border-border lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-foreground text-lg">
              Chat with Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Messages */}
            <div className="max-h-[400px] min-h-[400px] space-y-4 overflow-y-auto pr-4">
              <p>messages</p>
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <Input
                className="flex-1"
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask about forecasts, scenarios, or marketing..."
                value={input}
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
              <CardTitle className="text-foreground text-lg">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickActions.map((action) => (
                <Button
                  className="w-full justify-start"
                  key={action.label}
                  onClick={() => setInput(action.label)}
                  variant="outline"
                >
                  <action.icon className="mr-2 h-4 w-4" />
                  {action.label}
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground text-lg">
                Capabilities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Badge className="mr-2 mb-2" variant="secondary">
                Explain predictions
              </Badge>
              <Badge className="mr-2 mb-2" variant="secondary">
                Marketing advice
              </Badge>
              <Badge className="mr-2 mb-2" variant="secondary">
                Scenario analysis
              </Badge>
              <Badge className="mr-2 mb-2" variant="secondary">
                Revenue insights
              </Badge>
              <Badge className="mr-2 mb-2" variant="secondary">
                Risk assessment
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Example Queries */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground text-lg">
            Example Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-muted p-4">
              <p className="mb-1 font-medium text-foreground text-sm">
                "Which December games need extra marketing?"
              </p>
              <p className="text-muted-foreground text-xs">
                Get targeted recommendations for underperforming games
              </p>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <p className="mb-1 font-medium text-foreground text-sm">
                "Explain the Berlin game prediction"
              </p>
              <p className="text-muted-foreground text-xs">
                Understand the factors driving specific forecasts
              </p>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <p className="mb-1 font-medium text-foreground text-sm">
                "Summarize November revenue outlook"
              </p>
              <p className="text-muted-foreground text-xs">
                Get executive summaries of monthly performance
              </p>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <p className="mb-1 font-medium text-foreground text-sm">
                "What if we increase prices by 10%?"
              </p>
              <p className="text-muted-foreground text-xs">
                Run what-if scenarios for strategic decisions
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
