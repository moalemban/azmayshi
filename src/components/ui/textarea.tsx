"use client";

import * as React from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import {cn} from '@/lib/utils';

// Define the props by omitting the conflicting 'style' prop and adding our own.
export type TextareaProps = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  'style'
> & {
  style?: { height?: number };
};

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({className, ...props}, ref) => {
    return (
      <TextareaAutosize
        className={cn(
          'flex w-full rounded-lg border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          'min-h-[80px]'
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export {Textarea};
