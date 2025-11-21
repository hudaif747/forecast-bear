"use client";

import { AlertTriangle, DollarSign, TrendingUp, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDashboardStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import SeasonAttendanceOutlook from "./SeasonAttendanceOutlook";

const turnoutColors = {
  high: "bg-success/20 text-success border-success",
  medium: "bg-warning/20 text-warning border-warning",
  low: "bg-danger/20 text-danger border-danger",
};

const rowColors = {
  high: "border-l-4 border-l-success hover:bg-success/5",
  medium: "border-l-4 border-l-warning hover:bg-warning/5",
  low: "border-l-4 border-l-danger hover:bg-danger/5",
};

const ITEMS_PER_PAGE = 5;

export default function Dashboard() {
  const router = useRouter();
  const { upcomingGames, kpis } = useDashboardStore();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(upcomingGames.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedGames = upcomingGames.slice(startIndex, endIndex);

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push("ellipsis");
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("ellipsis");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="space-y-6 p-6">
      {/* Season Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl text-foreground">
            Season Forecast Dashboard
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <Badge className="bg-primary/10 text-primary border-primary" variant="outline">
              2025-26 Season
            </Badge>
            <span className="text-muted-foreground text-sm">
              {upcomingGames.length} Home Games
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <Card className="border-border" key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="font-medium text-muted-foreground text-sm">
                {kpi.title}
              </CardTitle>
              <kpi.icon className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-3xl text-foreground">
                {kpi.value}
              </div>
              <p className="mt-1 text-muted-foreground text-xs">
                {kpi.subtitle}
              </p>
              <Badge className="mt-2" variant="secondary">
                {kpi.trend}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upcoming Games Forecast Table */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground text-xl">
            Upcoming Home Games Forecast
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            Click on any game to view detailed predictions and scenarios • Day tickets only (season tickets not included)
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Date</TableHead>
                <TableHead>Opponent</TableHead>
                <TableHead>Day / Time</TableHead>
                <TableHead className="text-right">Predicted Tickets</TableHead>
                <TableHead className="text-right">Predicted Revenue</TableHead>
                <TableHead className="text-right">Occupancy</TableHead>
                <TableHead className="text-center">Expected Turnout</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedGames.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No games found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedGames.map((game, index) => (
                  <TableRow
                    className={cn(
                      rowColors[game.confidence as keyof typeof rowColors],
                      "cursor-pointer"
                    )}
                    key={startIndex + index}
                    onClick={() => router.push(`/dashboard/games/${game.id}`)}
                  >
                  <TableCell className="font-medium text-foreground">
                    {new Date(game.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {game.opponent}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {game.weekday} {game.faceoff}
                  </TableCell>
                  <TableCell className="text-right text-foreground">
                    {game.predictedTickets.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right text-foreground">
                    €{game.predictedRevenue.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-semibold text-foreground">
                      {game.occupancy}%
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      className={
                        turnoutColors[
                          game.confidence as keyof typeof turnoutColors
                        ]
                      }
                      variant="outline"
                    >
                      {game.confidence === "high" ? "High" : game.confidence === "medium" ? "Medium" : "Low"}
                    </Badge>
                  </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          {totalPages > 1 && (
            <div className="border-t border-border p-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) {
                          setCurrentPage(currentPage - 1);
                        }
                      }}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                  {getPageNumbers().map((page, index) => (
                    <PaginationItem key={index}>
                      {page === "ellipsis" ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(page);
                          }}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) {
                          setCurrentPage(currentPage + 1);
                        }
                      }}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Seasonal Performance */}
      <SeasonAttendanceOutlook />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="cursor-pointer border-border transition-colors hover:border-primary">
          <CardContent className="pt-6">
            <h3 className="mb-2 font-semibold text-foreground text-lg">
              Find Low-Performing Games
            </h3>
            <p className="text-muted-foreground text-sm">
              Identify games with occupancy below 75% for targeted marketing
            </p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer border-border transition-colors hover:border-primary">
          <CardContent className="pt-6">
            <h3 className="mb-2 font-semibold text-foreground text-lg">
              Optimize Marketing Allocation
            </h3>
            <p className="text-muted-foreground text-sm">
              Get AI-driven recommendations on which games need promotion boost
            </p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer border-border transition-colors hover:border-primary">
          <CardContent className="pt-6">
            <h3 className="mb-2 font-semibold text-foreground text-lg">
              Run Scenario Analysis
            </h3>
            <p className="text-muted-foreground text-sm">
              Simulate best-case, worst-case, and expected outcomes
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
