import { useTheme } from "@/hooks/use-theme";

export default function ThemeTest() {
  const { theme } = useTheme();
  
  return (
    <div className="p-8 rounded-lg bg-card/50 backdrop-blur-sm border">
      <h2 className="text-2xl font-bold mb-4">Theme Test Component</h2>
      <p className="text-muted-foreground mb-2">Current theme: <span className="font-semibold">{theme}</span></p>
      <p className="text-sm">
        This component shows the current theme state. The background should show a 
        {theme === 'dark' ? ' dark grey gradient' : ' light gradient'}.
      </p>
      <div className="mt-4 p-4 bg-primary text-primary-foreground rounded">
        Primary colored section
      </div>
      <div className="mt-2 p-4 bg-secondary text-secondary-foreground rounded">
        Secondary colored section
      </div>
    </div>
  );
}
