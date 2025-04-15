import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Keep Select import for potential future use if needed, but not used now
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, KeyRound } from 'lucide-react'; // Added KeyRound icon
import { Separator } from '@/components/ui/separator'; // Added Separator

// Define available LLM providers
const llmProviders = [
  { id: 'openai', name: 'OpenAI', models: '(GPT-4, GPT-3.5, etc.)' },
  { id: 'anthropic', name: 'Anthropic', models: '(Claude 3 Opus, Sonnet, Haiku)' },
  { id: 'google', name: 'Google', models: '(Gemini Pro, etc.)' },
  // Add more providers as needed
];

// Type for storing multiple keys
type ApiKeysState = {
  [providerId: string]: string;
};

// Type for managing visibility of multiple keys
type ApiKeyVisibilityState = {
  [providerId: string]: boolean;
};

const AIConfigTab = () => {
  const { toast } = useToast();
  // TODO: Load initial values from user context or persistent storage
  const [apiKeys, setApiKeys] = useState<ApiKeysState>({});
  const [apiKeyVisibility, setApiKeyVisibility] = useState<ApiKeyVisibilityState>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleApiKeyChange = (providerId: string, value: string) => {
    setApiKeys(prev => ({ ...prev, [providerId]: value }));
  };

  const toggleApiKeyVisibility = (providerId: string) => {
    setApiKeyVisibility(prev => ({ ...prev, [providerId]: !prev[providerId] }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    console.log("Saving AI Config:", apiKeys);
    // TODO: Implement actual saving logic (e.g., API call, update context/storage)
    // Filter out empty keys before saving if desired
    const keysToSave = Object.entries(apiKeys)
      .filter(([_, key]) => key.trim() !== '')
      .reduce((acc, [id, key]) => ({ ...acc, [id]: key }), {});
    console.log("Filtered Keys to Save:", keysToSave);

    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate save delay
    toast({
      title: "API Keys Saved",
      description: "Your LLM API key configuration has been updated.",
    });
    setIsSaving(false);
  };

  // Check if any key has been entered to enable save button
  const canSave = Object.values(apiKeys).some(key => key.trim() !== '');

  return (
    <Card>
      <CardHeader>
        <CardTitle>LLM API Keys</CardTitle>
        <CardDescription>
          Enter the API keys for the LLM providers you want to use. Keys are stored securely.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {llmProviders.map((provider, index) => (
          <React.Fragment key={provider.id}>
            {index > 0 && <Separator />} {/* Add separator between providers */}
            <div className="space-y-3">
              <h3 className="text-md font-semibold flex items-center gap-2">
                 <KeyRound size={18} className="text-muted-foreground" />
                 {provider.name} <span className="text-sm text-muted-foreground font-normal">{provider.models}</span>
              </h3>
              <div className="space-y-1">
                <Label htmlFor={`api-key-${provider.id}`} className="text-xs">API Key for {provider.name}</Label>
                <div className="relative">
                  <Input
                    id={`api-key-${provider.id}`}
                    type={apiKeyVisibility[provider.id] ? 'text' : 'password'}
                    value={apiKeys[provider.id] || ''}
                    onChange={(e) => handleApiKeyChange(provider.id, e.target.value)}
                    placeholder={`Enter your ${provider.name} API Key`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground"
                    onClick={() => toggleApiKeyVisibility(provider.id)}
                    aria-label={apiKeyVisibility[provider.id] ? `Hide ${provider.name} API key` : `Show ${provider.name} API key`}
                    disabled={!apiKeys[provider.id]} // Disable toggle if key is empty
                  >
                    {apiKeyVisibility[provider.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
              </div>
            </div>
          </React.Fragment>
        ))}

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={handleSave} disabled={!canSave || isSaving}>
            {isSaving ? 'Saving...' : 'Save API Keys'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIConfigTab;
