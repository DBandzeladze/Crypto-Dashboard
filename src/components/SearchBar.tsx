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
          required
          onChange={handleSearchChange}
          value={searchTerm}
        />
      </div>
      <button className="inline-flex items-center justify-center shrink-0 text-white bg-indigo-400 hover:bg-indigo-500 focus:ring-4 shadow-xs rounded-sm w-10 h-10 focus:outline-none cursor-pointer">
        <Icon className="" icon={"bi:search"} />
      </button>
    </form>
  );
}
