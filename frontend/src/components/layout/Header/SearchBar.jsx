import {useState, useCallback} from 'react';
import {CameraIcon, SearchIcon} from '../../Icons/Icons.jsx';

/**
 * 搜尋列組件
 * @param {Object} props
 * @param {Function} props.onSearch - 搜尋回調
 */
const SearchBar = ({onSearch}) => {
    const [query, setQuery] = useState('');

    const handleSubmit = useCallback(
        (e) => {
            e.preventDefault();
            onSearch(query);
        },
        [query, onSearch]
    );

    const handleKeyDown = useCallback(
        (e) => {
            if (e.key === 'Enter') {
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
            <button
                type="button"
                className="header__camera-button"
                aria-label="相機搜尋"
                // TODO: 實現相機搜尋功能
            >
                <CameraIcon/>
            </button>
            <button
                type="submit"
                className="header__search-button"
                aria-label="搜尋"
            >
                <SearchIcon className={'header__search-icon--searchbar'} />
            </button>
        </form>
    );
};

export default SearchBar;