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
      className="justify-start"
    >
      {options.map((option) => (
        <ToggleGroupItem 
          key={option.value} 
          value={option.value}
          className="text-xs px-3 py-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
        >
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
