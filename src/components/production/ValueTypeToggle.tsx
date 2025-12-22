import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ValueType, DiscountType } from "./types";

interface ValueTypeToggleProps {
  value: ValueType | DiscountType;
  onChange: (value: ValueType | DiscountType) => void;
  options?: { value: string; label: string }[];
}

export function ValueTypeToggle({ 
  value, 
  onChange, 
  options = [
    { value: 'units', label: 'Unidades (U)' },
    { value: 'money', label: 'Dinero ($)' }
  ] 
}: ValueTypeToggleProps) {
  return (
    <ToggleGroup 
      type="single" 
      value={value} 
      onValueChange={(v) => v && onChange(v as ValueType | DiscountType)}
      className="inline-flex gap-1 rounded-lg bg-muted/50 p-1"
    >
      {options.map((option) => (
        <ToggleGroupItem 
          key={option.value} 
          value={option.value}
          className="rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all duration-200 data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm hover:text-foreground"
        >
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
