import { useCallback, useState } from "react";
import { CameraIcon, SearchIcon } from "../../Icons/Icons";

type SearchBarProps = {
  onSearch: (query: string) => void;
};

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      onSearch(query);
    },
    [query, onSearch]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        onSearch(query);
      }
    },
    [query, onSearch]
  );

  return (
    <form className="header__search-bar" onSubmit={handleSubmit}>
      <input
        id="search-input"
        type="text"
        className="header__search-input"
        placeholder="寬鬆西裝外套"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
      />
      <button type="button" className="header__camera-button" aria-label="相機搜尋">
        <CameraIcon />
      </button>
      <button type="submit" className="header__search-button" aria-label="搜尋">
        <SearchIcon className="header__search-icon--searchbar" />
      </button>
    </form>
  );
};

export default SearchBar;
