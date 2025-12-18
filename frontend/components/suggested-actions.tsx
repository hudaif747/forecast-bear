"use client";

import type { UseChatHelpers } from "@ai-sdk/react";
import { motion } from "framer-motion";
import { memo } from "react";
import { PAGE_ROUTES } from "@/lib/constants";
import type { ChatMessage } from "@/lib/types";
import { Suggestion } from "./elements/suggestion";
import type { VisibilityType } from "./visibility-selector";

type SuggestedActionsProps = {
  chatId: string;
  sendMessage: UseChatHelpers<ChatMessage>["sendMessage"];
  selectedVisibilityType: VisibilityType;
};

function PureSuggestedActions({ chatId, sendMessage }: SuggestedActionsProps) {
  const suggestedActions = [
    "Executive summary: next 30 days — biggest upside and biggest risks (with charts) + recommended actions",
    "Rank the top 5 highest revenue games and explain the key demand drivers for each (exec-friendly)",
    "Which upcoming games are most at risk of under-selling? Prioritize 3 interventions (pricing, promo, inventory) and why",
    "Season outlook: monthly forecast for tickets + revenue (separate charts) + what’s driving the peaks and dips",
    "Opponent analysis: which opponents consistently over/under-perform vs baseline? Show a chart + implications for pricing",
    "If we want +5% revenue this month, where should we focus first? Give 3 concrete levers and the games affected",
  ];

  return (
    <div
      className="grid w-full gap-2 sm:grid-cols-2"
      data-testid="suggested-actions"
    >
      {suggestedActions.map((suggestedAction, index) => (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          initial={{ opacity: 0, y: 20 }}
          key={suggestedAction}
          transition={{ delay: 0.05 * index }}
        >
          <Suggestion
            className="h-auto w-full whitespace-normal p-3 text-center"
            onClick={(suggestion) => {
              window.history.replaceState({}, "", PAGE_ROUTES.chat(chatId));
              sendMessage({
                role: "user",
                parts: [{ type: "text", text: suggestion }],
              });
            }}
            suggestion={suggestedAction}
          >
            {suggestedAction}
          </Suggestion>
        </motion.div>
      ))}
    </div>
  );
}

export const SuggestedActions = memo(
  PureSuggestedActions,
  (prevProps, nextProps) => {
    if (prevProps.chatId !== nextProps.chatId) {
      return false;
    }
    if (prevProps.selectedVisibilityType !== nextProps.selectedVisibilityType) {
      return false;
    }

    return true;
  }
);
