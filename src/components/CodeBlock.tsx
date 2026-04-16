import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Check } from '@phosphor-icons/react';
import { toast } from 'sonner';

interface CodeBlockProps {
  code: string;
  language: string;
  title: string;
}

export function CodeBlock({ code, language, title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success('Code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy code');
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base font-mono">{title}</CardTitle>
            <Badge variant="outline" className="font-mono text-xs">
              {language}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            className="h-8 w-8"
          >
            {copied ? <Check className="text-success" /> : <Copy />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        <pre className="text-xs leading-relaxed font-mono bg-muted/30 p-4 rounded-md overflow-x-auto">
          <code className="text-foreground">{code}</code>
        </pre>
      </CardContent>
    </Card>
  );
}
