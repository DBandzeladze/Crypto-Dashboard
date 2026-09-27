import { Icon } from "@iconify/react";
import { useState, type ChangeEvent } from "react";

type SearchBarProps = {
  searchTerm: string;
  onSearchChange: React.Dispatch<React.SetStateAction<string>>;
};

export function SearchBar({ searchTerm, onSearchChange }: SearchBarProps) {
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };
  return (
    <form className="flex items-center max-w-sm space-x-2">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <div className="relative w-full">
        <input
          type="text"
          id="search"
          className="px-3 py-2.5 bg-white border border-indigo-100 rounded-md ps-9 text-heading text-sm block w-full placeholder:text-body"
          placeholder="Search currency..."
          onChange={handleSearchChange}
          value={searchTerm}
        />
        <span className="absolute inset-y-0 end-0 flex items-center justify-center text-indigo-200 w-10 h-10">
          <Icon className="" icon={"bi:search"} />
        </span>
      </div>
    </form>
  );
}
