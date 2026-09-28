import { Icon } from "@iconify/react";

type HiddenCurrenciesToggleProps = {
  isOpen: boolean;
  onOpenchange: React.Dispatch<React.SetStateAction<boolean>>;
  HiddenCount: number;
};

export function HiddenCurrenciesToggle({
  isOpen,
  onOpenchange,
  HiddenCount,
}: HiddenCurrenciesToggleProps) {
  function HandleOpenchange() {
    onOpenchange((prev) => !prev);
  }
  return (
    <div className="">
      <button
        onClick={HandleOpenchange}
        className={`cursor-pointer flex items-center justify-center px-2 py-1 rounded-sm text-indigo-400 hover:text-indigo-500`}
      >
        {isOpen
          ? `Hide hidden (${HiddenCount})`
          : `Show hidden (${HiddenCount})`}
        <Icon
          icon={
            isOpen
              ? "gravity-ui:triangle-up-fill"
              : "gravity-ui:triangle-down-fill"
          }
          className="ml-2"
        />
      </button>
    </div>
  );
}
