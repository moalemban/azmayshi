"use client";

import { useState, useEffect } from 'react';
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
import type { ConversionSuggestion } from '@/lib/types';
import { Separator } from '../ui/separator';

const formSchema = z.object({
  value: z.coerce.number().min(0, "مقدار باید یک عدد مثبت باشد."),
  unit: z.string().min(1, "لطفا یک واحد انتخاب کنید."),
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
        title: "خطا در ارتباط با هوش مصنوعی",
        description: result.error,
      });
    }
  }

  useEffect(() => {
    form.handleSubmit(onSubmit)();
  }, []);

  return (
    <Card className="h-full group/card transition-all duration-300 hover:border-primary/50">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Scale className="h-7 w-7 text-primary" />
          تبدیل واحد هوشمند
        </CardTitle>
        <CardDescription className="flex items-center gap-1.5 pt-1">
          <Sparkles className="h-4 w-4 text-primary/80" />
          پیشنهادهای هوشمند با کمک هوش مصنوعی Gemini
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>مقدار</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="مقدار را وارد کنید" {...field} className="h-12 text-lg" />
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
                    <FormLabel>واحد</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 text-lg">
                          <SelectValue placeholder="یک واحد انتخاب کنید" />
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
            <Button type="submit" disabled={isLoading} className="w-full h-12 text-lg font-bold">
              {isLoading ? (
                <>
                  <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                  در حال دریافت پیشنهاد...
                </>
              ) : (
                'دریافت پیشنهاد تبدیل'
              )}
            </Button>
          </form>
        </Form>
        {(isLoading || suggestions.length > 0) && (
            <div className="mt-8">
                <Separator className="my-6 bg-border/50" />
                <h3 className="text-xl font-semibold mb-4 text-center">✨ پیشنهادها ✨</h3>
                {isLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[...Array(3)].map((_, i) => (
                           <div key={i} className="p-4 border rounded-lg bg-background/50 text-center space-y-2">
                               <div className="h-8 w-3/4 mx-auto animate-pulse rounded-md bg-muted"></div>
                               <div className="h-4 w-1/2 mx-auto animate-pulse rounded-md bg-muted"></div>
                           </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {suggestions.map((s, i) => (
                            <div key={i} className="p-4 border border-dashed rounded-lg bg-background/30 text-center transition-all hover:border-solid hover:border-primary/50 hover:bg-background/80">
                                <div className="text-3xl font-bold text-primary" dir="ltr">
                                    {s.convertedValue.toLocaleString('fa-IR', { maximumFractionDigits: 4 })}
                                </div>
                                <div className="text-sm text-muted-foreground mt-1">{s.targetUnit}</div>
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
