import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Webhook, 
  Key, 
  Send, 
  Copy, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  Code,
  Database,
  Download
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface WebhookConfig {
  url: string;
  events: string[];
  headers: Record<string, string>;
}

const ApiIntegration: React.FC = () => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookEvents, setWebhookEvents] = useState<string[]>(['onboarding.completed']);
  const [customHeaders, setCustomHeaders] = useState<Record<string, string>>({});
  const [apiKey, setApiKey] = useState('your-api-key-here');
  const [testPayload, setTestPayload] = useState('');
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);

  const baseUrl = `https://wowtanjkkwjahwmwromy.supabase.co/functions/v1`;

  const availableEvents = [
    { id: 'onboarding.started', name: 'Onboarding Started', description: 'When a new employee begins onboarding' },
    { id: 'onboarding.step_completed', name: 'Step Completed', description: 'When an onboarding step is finished' },
    { id: 'onboarding.completed', name: 'Onboarding Completed', description: 'When the full onboarding process is done' },
    { id: 'onboarding.approved', name: 'Onboarding Approved', description: 'When HR approves the onboarding' },
    { id: 'employee.created', name: 'Employee Created', description: 'When employee data is finalized' },
    { id: 'user.created', name: 'User Created - Admin Notification', description: 'Sends all user information to admins when a user is created' },
    { id: 'user.welcome', name: 'User Welcome Email', description: 'Sends welcome email with credentials to new users' },
    { id: 'task.assigned', name: 'Task Assigned', description: 'Notifies user when they are assigned a task' },
  ];

  const apiEndpoints = [
    {
      method: 'GET',
      endpoint: '/api-endpoints/onboarding/forms',
      description: 'Get all onboarding forms',
      params: 'limit, offset, status'
    },
    {
      method: 'GET',
      endpoint: '/api-endpoints/onboarding/forms/{id}',
      description: 'Get specific onboarding form',
      params: 'id (UUID)'
    },
    {
      method: 'GET',
      endpoint: '/api-endpoints/teams',
      description: 'Get all teams',
      params: 'none'
    },
    {
      method: 'GET',
      endpoint: '/api-endpoints/managers',
      description: 'Get all managers',
      params: 'none'
    },
    {
      method: 'POST',
      endpoint: '/api-endpoints/onboarding/export',
      description: 'Export onboarding data',
      params: 'format, filters'
    },
  ];

  const handleCopyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  const handleTestWebhook = async () => {
    if (!webhookUrl) {
      toast({
        title: "Error",
        description: "Please enter a webhook URL",
        variant: "destructive",
      });
      return;
    }

    setIsTestingWebhook(true);
    try {
      const payload = testPayload || JSON.stringify({
        event: 'test',
        timestamp: new Date().toISOString(),
        data: {
          test: true,
          message: 'This is a test webhook from TriGuard Onboarding'
        }
      }, null, 2);

      const { data, error } = await supabase.functions.invoke('webhook-integration', {
        body: {
          event_type: 'webhook.test',
          webhook_url: webhookUrl,
          headers: customHeaders,
          data: JSON.parse(payload)
        }
      });

      if (error) throw error;

      toast({
        title: "Webhook Test Sent",
        description: `Test webhook sent successfully. Status: ${data.delivery_result?.status || 'Unknown'}`,
      });
    } catch (error: any) {
      toast({
        title: "Webhook Test Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsTestingWebhook(false);
    }
  };

  const toggleEvent = (eventId: string) => {
    setWebhookEvents(prev => 
      prev.includes(eventId) 
        ? prev.filter(e => e !== eventId)
        : [...prev, eventId]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
          <Code className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">API Integration</h2>
          <p className="text-muted-foreground">Connect external systems and automate workflows</p>
        </div>
      </div>

      <Tabs defaultValue="webhooks" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="webhooks" className="flex items-center gap-2">
            <Webhook className="h-4 w-4" />
            Webhooks
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            API Endpoints
          </TabsTrigger>
          <TabsTrigger value="examples" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Examples
          </TabsTrigger>
        </TabsList>

        <TabsContent value="webhooks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Webhook className="h-5 w-5" />
                Webhook Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="webhook-url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://your-app.com/webhooks/triguard"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyToClipboard(webhookUrl, 'Webhook URL')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Events to Subscribe</Label>
                <div className="grid gap-3">
                  {availableEvents.map((event) => (
                    <div key={event.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <input
                        type="checkbox"
                        id={event.id}
                        checked={webhookEvents.includes(event.id)}
                        onChange={() => toggleEvent(event.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <label htmlFor={event.id} className="font-medium cursor-pointer">
                          {event.name}
                        </label>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label>Test Webhook</Label>
                <Textarea
                  value={testPayload}
                  onChange={(e) => setTestPayload(e.target.value)}
                  placeholder='{"test": true, "message": "Custom test payload"}'
                  className="font-mono text-sm"
                  rows={4}
                />
                <Button 
                  onClick={handleTestWebhook} 
                  disabled={isTestingWebhook}
                  className="w-full"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isTestingWebhook ? 'Testing...' : 'Test Webhook'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                API Authentication
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-800">API Key Required</p>
                    <p className="text-sm text-amber-700">
                      Add the <code>TRIGUARD_API_KEY</code> secret in Supabase Edge Function settings to protect your API endpoints.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Base URL</Label>
                <div className="flex gap-2">
                  <Input value={baseUrl} readOnly className="font-mono" />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyToClipboard(baseUrl, 'Base URL')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Authentication Header</Label>
                <div className="flex gap-2">
                  <Input 
                    value="x-api-key: your-secret-api-key" 
                    readOnly 
                    className="font-mono" 
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyToClipboard('x-api-key: your-secret-api-key', 'Auth Header')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Available Endpoints</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apiEndpoints.map((endpoint, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-3">
                      <Badge variant={endpoint.method === 'GET' ? 'secondary' : 'default'}>
                        {endpoint.method}
                      </Badge>
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {endpoint.endpoint}
                      </code>
                    </div>
                    <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                    {endpoint.params !== 'none' && (
                      <p className="text-xs text-muted-foreground">
                        <strong>Parameters:</strong> {endpoint.params}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="examples" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Integration Examples</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Webhook Handler (Node.js/Express)
                </h3>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`app.post('/webhooks/triguard', (req, res) => {
  const { event, data, timestamp } = req.body;
  
  switch (event) {
    case 'onboarding.completed':
      // Add to HR system
      await createEmployee(data);
      // Send welcome email
      await sendWelcomeEmail(data.email);
      break;
      
    case 'onboarding.approved':
      // Grant system access
      await createUserAccount(data);
      break;
  }
  
  res.json({ received: true });
});`}
                </pre>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Fetch Onboarding Data (JavaScript)
                </h3>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`const response = await fetch(
  '${baseUrl}/api-endpoints/onboarding/forms?status=completed&limit=10',
  {
    headers: {
      'x-api-key': 'your-api-key',
      'Content-Type': 'application/json'
    }
  }
);

const { data } = await response.json();
console.log('Completed onboarding forms:', data);`}
                </pre>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  Export Data (Python)
                </h3>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`import requests

response = requests.post(
    '${baseUrl}/api-endpoints/onboarding/export',
    headers={'x-api-key': 'your-api-key'},
    json={
        'format': 'json',
        'filters': {
            'status': 'completed',
            'date_from': '2024-01-01'
        }
    }
)

data = response.json()
print(f"Exported {data['count']} records")`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApiIntegration;