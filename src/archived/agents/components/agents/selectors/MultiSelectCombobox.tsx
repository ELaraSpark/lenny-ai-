import React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
export interface SelectableItem {
  id: string;
  [key: string]: any;
}
interface MultiSelectComboboxProps<T extends SelectableItem> {
  items: T[];
  selectedItems: string[];
  onItemsSelect: (items: string[]) => void;
  label: string;
  placeholder: string;
  searchPlaceholder: string;
  emptyMessage: string;
  groupLabel: string;
  getDisplayText: (item: T) => string;
  getSecondaryText?: (item: T) => string | null;
  getBadgeLabel: (item: T) => string;
  maxBadgeTextLength?: number;
}
const MultiSelectCombobox = <T extends SelectableItem,>({
  items,
  selectedItems,
  onItemsSelect,
  label,
  placeholder,
  searchPlaceholder,
  emptyMessage,
  groupLabel,
  getDisplayText,
  getSecondaryText,
  getBadgeLabel,
  maxBadgeTextLength = 20
}: MultiSelectComboboxProps<T>) => {
  const [open, setOpen] = React.useState(false);
  const handleItemToggle = (itemId: string) => {
    let updatedItems;
    if (selectedItems.includes(itemId)) {
      updatedItems = selectedItems.filter(id => id !== itemId);
    } else {
      updatedItems = [...selectedItems, itemId];
    }
    onItemsSelect(updatedItems);
  };
  return <div>
      <label className="text-sm font-medium mb-1 block">{label}</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between font-normal">
            {selectedItems.length > 0 ? `${selectedItems.length} selected` : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandList>
              <CommandGroup heading={groupLabel}>
                {items.map(item => <CommandItem key={item.id} value={item.id} onSelect={() => handleItemToggle(item.id)} className="flex items-center space-x-2">
                    <div className={cn("flex h-4 w-4 items-center justify-center rounded border", selectedItems.includes(item.id) ? "bg-primary border-primary" : "opacity-50")}>
                      {selectedItems.includes(item.id) && <Check className="h-3 w-3 text-primary-foreground" />}
                    </div>
                    <div className="flex flex-col">
                      <span>{getDisplayText(item)}</span>
                      {getSecondaryText && getSecondaryText(item) && <span className="text-xs text-muted-foreground">
                          {getSecondaryText(item)}
                        </span>}
                    </div>
                  </CommandItem>)}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      
      {/* Display selected items */}
      {selectedItems.length > 0 && <div className="flex flex-wrap gap-1 mt-2">
          {selectedItems.map(id => {
        const item = items.find(i => i.id === id);
        if (!item) return null;
        const badgeLabel = getBadgeLabel(item);
        const displayText = badgeLabel.length > maxBadgeTextLength ? `${badgeLabel.substring(0, maxBadgeTextLength)}...` : badgeLabel;
        return <Badge key={id} variant="outline" className="text-xs" onClick={() => handleItemToggle(id)}>
                {displayText} ✕
              </Badge>;
      })}
        </div>}
    </div>;
};
export default MultiSelectCombobox;