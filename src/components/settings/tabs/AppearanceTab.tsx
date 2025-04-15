import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Palette, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme, colorThemes } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';

const AppearanceTab = () => {
  const { themeMode, setThemeMode, colorTheme, setColorTheme } = useTheme();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = React.useState(false);

  const handleThemeChange = (value: string) => {
    setThemeMode(value as 'light' | 'dark');
  };
  
  const handleColorThemeChange = (value: string) => {
    setColorTheme(value);
  };
  
  const handleSavePreferences = () => {
    setIsSaving(true);
    
    // Simulate saving to backend
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Preferences saved",
        description: "Your appearance settings have been saved.",
      });
    }, 800);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Customize the look and feel of the application.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="theme" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="theme">Light/Dark Mode</TabsTrigger>
              <TabsTrigger value="colors">Color Theme</TabsTrigger>
            </TabsList>
            
            <TabsContent value="theme" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Theme Mode</Label>
                <RadioGroup 
                  defaultValue="light" 
                  value={themeMode} 
                  onValueChange={handleThemeChange}
                  className="grid max-w-md grid-cols-2 gap-8 pt-2"
                >
                  <Label className="[&:has([data-state=checked])>div]:border-primary">
                    <RadioGroupItem value="light" id="light" className="sr-only" />
                    <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
                      <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
                        <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                          <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
                          <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                        </div>
                        <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                          <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                          <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                        </div>
                        <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                          <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                          <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                        </div>
                      </div>
                    </div>
                    <span className="block w-full p-2 text-center font-normal">
                      Light
                    </span>
                  </Label>
                  <Label className="[&:has([data-state=checked])>div]:border-primary">
                    <RadioGroupItem value="dark" id="dark" className="sr-only" />
                    <div className="items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground">
                      <div className="space-y-2 rounded-sm bg-slate-950 p-2">
                        <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                          <div className="h-2 w-[80px] rounded-lg bg-slate-400" />
                          <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                        </div>
                        <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                          <div className="h-4 w-4 rounded-full bg-slate-400" />
                          <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                        </div>
                        <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                          <div className="h-4 w-4 rounded-full bg-slate-400" />
                          <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                        </div>
                      </div>
                    </div>
                    <span className="block w-full p-2 text-center font-normal">
                      Dark
                    </span>
                  </Label>
                </RadioGroup>
              </div>
            </TabsContent>
            
            <TabsContent value="colors" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Medical Color Themes
                </Label>
                <p className="text-sm text-muted-foreground">
                  Choose a color theme that matches your medical specialty or personal preference.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                  {colorThemes.map((theme) => (
                    <div 
                      key={theme.id}
                      className={cn(
                        "relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-md",
                        colorTheme === theme.id 
                          ? "border-primary shadow-sm" 
                          : "border-muted hover:border-primary/50"
                      )}
                      onClick={() => handleColorThemeChange(theme.id)}
                    >
                      {/* Selected indicator */}
                      {colorTheme === theme.id && (
                        <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                      
                      {/* Theme name and description */}
                      <h3 className="font-medium mb-1">{theme.name}</h3>
                      <p className="text-xs text-muted-foreground mb-3">{theme.description}</p>
                      
                      {/* Color swatches */}
                      <div className="flex gap-2">
                        <div 
                          className="h-6 w-6 rounded-full shadow-sm" 
                          style={{ backgroundColor: theme.colors.primary }}
                          title="Primary"
                        />
                        <div 
                          className="h-6 w-6 rounded-full shadow-sm" 
                          style={{ backgroundColor: theme.colors.secondary }}
                          title="Secondary"
                        />
                        <div 
                          className="h-6 w-6 rounded-full shadow-sm" 
                          style={{ backgroundColor: theme.colors.accent }}
                          title="Accent"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Add other appearance settings like font size, density etc. */}
          <div className="flex justify-start pt-4 border-t border-gray-200">
            <Button 
              onClick={handleSavePreferences} 
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              {isSaving ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Preferences
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppearanceTab;
