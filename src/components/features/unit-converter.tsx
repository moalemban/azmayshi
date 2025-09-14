"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Scale, Sparkles, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getSuggestedConversions } from '@/app/actions/suggest-conversions';
import { unitCategories } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';
import type { ConversionSuggestion } from '@/lib/types';
import { Separator } from '../ui/separator';

const formSchema = z.object({
  value: z.coerce.number().min(0, "Value must be a positive number."),
  unit: z.string().min(1, "Please select a unit."),
});

export default function UnitConverter() {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<ConversionSuggestion[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: 1,
      unit: "meter",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setSuggestions([]);
    const result = await getSuggestedConversions({
      inputValue: values.value,
      inputUnit: values.unit,
    });
    setIsLoading(false);

    if (result.success && result.data) {
      setSuggestions(result.data.suggestedConversions);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      });
    }
  }

  return (
    <Card className="h-full transition-transform transform hover:scale-[1.02] duration-300 ease-in-out">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scale className="h-6 w-6" />
          AI Unit Converter
        </CardTitle>
        <CardDescription className="flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-primary" />
          Powered by GenAI to suggest relevant conversions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Value</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter a value" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Unit</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(unitCategories).map(([category, units]) => (
                            <SelectGroup key={category}>
                                <SelectLabel>{category}</SelectLabel>
                                {units.map((unit) => (
                                    <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                                ))}
                            </SelectGroup>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Suggesting...
                </>
              ) : (
                'Suggest Conversions'
              )}
            </Button>
          </form>
        </Form>
        {(isLoading || suggestions.length > 0) && (
            <div className="mt-6">
                <Separator />
                <h3 className="text-lg font-medium mt-4 mb-2">Suggestions</h3>
                {isLoading ? (
                    <div className="space-y-2">
                        <div className="h-8 w-full animate-pulse rounded-md bg-muted"></div>
                        <div className="h-8 w-2/3 animate-pulse rounded-md bg-muted"></div>
                        <div className="h-8 w-5/6 animate-pulse rounded-md bg-muted"></div>
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-4">
                        {suggestions.map((s, i) => (
                            <div key={i} className="p-4 border rounded-lg bg-accent/50 text-center">
                                <div className="text-2xl font-bold" style={{color: '#6750A4'}}>
                                    {s.convertedValue.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                                </div>
                                <div className="text-sm text-muted-foreground">{s.targetUnit}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}
      </CardContent>
    </Card>
  );
}
