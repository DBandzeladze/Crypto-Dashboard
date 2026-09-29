import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

type CurrencyOption = {
  value: string;
  label: string;
};

type CurrencySelectorProps = {
  selectedItem: string;
  itemsList: CurrencyOption[];
  placeHolderText: string;
  onCurrencySelect: (currency: string) => void;
};

export function CurrencySelector({
  selectedItem,
  itemsList,
  placeHolderText,
  onCurrencySelect,
}: CurrencySelectorProps) {
  const selectedOption =
    itemsList.find((item) => item.value === selectedItem) ?? null;

  return (
    <Combobox
      items={itemsList}
      value={selectedOption}
      onValueChange={(value) => {
        onCurrencySelect(value?.value ?? "");
      }}
      itemToStringValue={(item) => item.label}
    >
      <ComboboxInput
        placeholder={placeHolderText}
        className="w-full border-indigo-200 bg-white"
      />
      <ComboboxContent>
        <ComboboxEmpty>No Currency found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem
              key={item.value}
              value={item}
              className="data-[highlighted]:bg-indigo-400 data-[highlighted]:text-white hover:bg-indigo-200"
            >
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
