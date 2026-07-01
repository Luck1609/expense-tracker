import type { JSX, ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function Heading({
  title,
  headingLevel = 2,
  description,
  variant = 'default',
  classNames
}: {
  title: ReactNode;
  description?: ReactNode;
  variant?: 'default' | 'small';
  headingLevel?: HeadingLevelType;
  classNames?: {
    header?: string;
    title?: string;
    description?: string;
  }
}) {  
  return (
    <header className={cn(variant === 'small' ? '' : 'space-y-1', classNames?.header)}>
      <HeadingLevel level={headingLevel}
        className={cn("text-2xl font-bold text-foreground", classNames?.title)}
      >
        {title}
      </HeadingLevel>
      {description && (
        <p className={cn("xt-sm text-muted-foreground mt-0.5", classNames?.description)}>{description}</p>
      )}
    </header>
  );
}


type HeadingLevelType = 1 | 2 | 3 | 4 | 5 | 6;

function HeadingLevel({ level, children, ...props }: { level: HeadingLevelType; children: ReactNode } & JSX.IntrinsicElements['h1']) {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  
  return <Tag {...props}>{children}</Tag>;
}