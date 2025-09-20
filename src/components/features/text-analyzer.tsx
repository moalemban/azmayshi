"use client";

import { useState, useMemo } from 'react';
import { CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

const StatCard = ({ label, value }: { label: string, value: number }) => (
  <div className="p-3 bg-muted/50 rounded-lg shadow-inner text-center">
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="text-2xl font-bold text-primary font-display">{value.toLocaleString('fa-IR')}</p>
  </div>
);

export default function TextAnalyzer() {
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    if (text.trim() === '') {
      return { words: 0, characters: 0, sentences: 0, paragraphs: 0 };
    }

    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const characters = text.length;
    
    // Count sentences based on '.', '!', '?', and Persian '؟'
    const sentences = (text.match(/[.!?؟]+/g) || []).length;
    
    // Count paragraphs based on one or more empty lines
    const paragraphs = text.split(/\n\s*\n/).filter(Boolean).length;

    return { words, characters, sentences, paragraphs };
  }, [text]);

  return (
    <CardContent className="space-y-4">
      <div className="relative">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="متن خود را اینجا وارد کنید یا بچسبانید..."
          className="min-h-[150px] text-base p-4 pl-12"
        />
        <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-2 left-2 text-muted-foreground hover:text-destructive"
            onClick={() => setText('')}
            disabled={!text}
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="کلمات" value={stats.words} />
        <StatCard label="کاراکترها" value={stats.characters} />
        <StatCard label="جملات" value={stats.sentences} />
        <StatCard label="پاراگراف‌ها" value={stats.paragraphs} />
      </div>
    </CardContent>
  );
}
