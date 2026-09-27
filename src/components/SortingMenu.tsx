import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { SortDirection, SortOption } from "@/types/market";

type SortSelection = {
  option: SortOption;
  direction: SortDirection;
};

type SortingMenuProps = {
  onSortChange: (selection: SortSelection) => void;
};

export function SortingMenu({ onSortChange }: SortingMenuProps) {
  function handleSortingOptionChange(
    option: SortOption,
    direction: SortDirection,
  ) {
    onSortChange({ option, direction });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            className="h-10.5 w-16 text-heading text-sm border-indigo-100 hover:bg-white text-gray-400 cursor-pointer shadow-none"
          >
            Sort
          </Button>
        }
      />
      <DropdownMenuContent className="w-50 cursor-pointer" align="start">
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => handleSortingOptionChange("name", "asc")}
            className="cursor-pointer"
          >
            Name: A → Z
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleSortingOptionChange("name", "desc")}
            className="cursor-pointer"
          >
            Name: Z → A
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleSortingOptionChange("currentPrice", "asc")}
            className="cursor-pointer"
          >
            Price: Low → High
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleSortingOptionChange("currentPrice", "desc")}
            className="cursor-pointer"
          >
            Price: High → Low
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleSortingOptionChange("priceChange", "asc")}
            className="cursor-pointer"
          >
            Change: Low → High
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleSortingOptionChange("priceChange", "desc")}
            className="cursor-pointer"
          >
            Change: High → Low
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
