import React from 'react';
import { cn } from '@/lib/utils';

interface StarProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  filled?: boolean;
}

const Star = React.forwardRef<SVGSVGElement, StarProps>(
  ({ className, filled = true, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        className={cn("h-[1.375rem] w-auto fill-current", className)}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 42 42"
        {...props}
      >
        <path d="M8.65653 37.9894L21 29.925V0L15.754 13.7795L1.02783 14.5106L12.5118 23.758L8.65653 37.9894Z" />
        <path d="M33.3435 37.9894L21 29.925V0L26.246 13.7795L40.9722 14.5106L29.4882 23.758L33.3435 37.9894Z" />
      </svg>
    );
  }
);

Star.displayName = "Star";

export { Star };