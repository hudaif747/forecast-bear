import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function Settings() {
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="mb-2 font-bold text-2xl text-foreground">Settings</h2>
        <p className="text-muted-foreground">
          Configure forecast parameters and notification preferences
        </p>
      </div>

      {/* Model Configuration */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground text-xl">
            Model Configuration
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            Adjust ML model parameters and prediction settings
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="confidence-threshold">
              Confidence Threshold (%)
            </Label>
            <Input
              defaultValue="75"
              id="confidence-threshold"
              placeholder="75"
              type="number"
            />
            <p className="text-muted-foreground text-xs">
              Minimum confidence level for predictions to be considered reliable
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="forecast-horizon">Forecast Horizon (weeks)</Label>
            <Input
              defaultValue="8"
              id="forecast-horizon"
              placeholder="8"
              type="number"
            />
            <p className="text-muted-foreground text-xs">
              How far ahead to generate predictions
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-update">Auto-update Predictions</Label>
              <p className="mt-1 text-muted-foreground text-xs">
                Automatically refresh forecasts with new data
              </p>
            </div>
            <Switch defaultChecked id="auto-update" />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground text-xl">
            Notifications
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            Configure alerts for low-confidence predictions and marketing
            opportunities
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="low-occupancy">Low Occupancy Alerts</Label>
              <p className="mt-1 text-muted-foreground text-xs">
                Notify when predicted occupancy falls below 75%
              </p>
            </div>
            <Switch defaultChecked id="low-occupancy" />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="high-risk">High-Risk Game Alerts</Label>
              <p className="mt-1 text-muted-foreground text-xs">
                Notify when confidence level is low for upcoming games
              </p>
            </div>
            <Switch defaultChecked id="high-risk" />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="weekly-summary">Weekly Summary Report</Label>
              <p className="mt-1 text-muted-foreground text-xs">
                Receive weekly forecast summaries via email
              </p>
            </div>
            <Switch id="weekly-summary" />
          </div>
        </CardContent>
      </Card>

      {/* Integration Status */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground text-xl">
            Integration Status
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            Data sources and API connections
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/20">
                <div className="h-2 w-2 rounded-full bg-success" />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">
                  Ticketing System
                </p>
                <p className="text-muted-foreground text-xs">Connected</p>
              </div>
            </div>
            <Badge className="bg-success/20 text-success" variant="secondary">
              Active
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/20">
                <div className="h-2 w-2 rounded-full bg-success" />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">
                  Weather API
                </p>
                <p className="text-muted-foreground text-xs">Connected</p>
              </div>
            </div>
            <Badge className="bg-success/20 text-success" variant="secondary">
              Active
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/20">
                <div className="h-2 w-2 rounded-full bg-success" />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">
                  DEL Statistics
                </p>
                <p className="text-muted-foreground text-xs">Connected</p>
              </div>
            </div>
            <Badge className="bg-success/20 text-success" variant="secondary">
              Active
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button>Save Changes</Button>
        <Button variant="outline">Reset to Defaults</Button>
      </div>
    </div>
  );
}
