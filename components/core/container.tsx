import { cn } from "@/lib/utils";

const Container = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("font-inter container mx-auto", className)}>
      {children}
    </div>
  );
};

export { Container };