import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

export default function Settings() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Settings</h2>
        <p className="text-muted-foreground">
          Configure forecast parameters and notification preferences
        </p>
      </div>

      {/* Model Configuration */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-xl text-foreground">Model Configuration</CardTitle>
          <p className="text-sm text-muted-foreground">
            Adjust ML model parameters and prediction settings
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="confidence-threshold">Confidence Threshold (%)</Label>
            <Input
              id="confidence-threshold"
              type="number"
              defaultValue="75"
              placeholder="75"
            />
            <p className="text-xs text-muted-foreground">
              Minimum confidence level for predictions to be considered reliable
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="forecast-horizon">Forecast Horizon (weeks)</Label>
            <Input
              id="forecast-horizon"
              type="number"
              defaultValue="8"
              placeholder="8"
            />
            <p className="text-xs text-muted-foreground">
              How far ahead to generate predictions
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-update">Auto-update Predictions</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Automatically refresh forecasts with new data
              </p>
            </div>
            <Switch id="auto-update" defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-xl text-foreground">Notifications</CardTitle>
          <p className="text-sm text-muted-foreground">
            Configure alerts for low-confidence predictions and marketing opportunities
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="low-occupancy">Low Occupancy Alerts</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Notify when predicted occupancy falls below 75%
              </p>
            </div>
            <Switch id="low-occupancy" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="high-risk">High-Risk Game Alerts</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Notify when confidence level is low for upcoming games
              </p>
            </div>
            <Switch id="high-risk" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="weekly-summary">Weekly Summary Report</Label>
              <p className="text-xs text-muted-foreground mt-1">
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
          <CardTitle className="text-xl text-foreground">Integration Status</CardTitle>
          <p className="text-sm text-muted-foreground">
            Data sources and API connections
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-success/20 flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-success" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Ticketing System</p>
                <p className="text-xs text-muted-foreground">Connected</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-success/20 text-success">Active</Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-success/20 flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-success" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Weather API</p>
                <p className="text-xs text-muted-foreground">Connected</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-success/20 text-success">Active</Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-success/20 flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-success" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">DEL Statistics</p>
                <p className="text-xs text-muted-foreground">Connected</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-success/20 text-success">Active</Badge>
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
