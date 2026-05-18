import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { BiSearchAlt2 } from "react-icons/bi";
import { BsFilter } from "react-icons/bs";
function SearchBar() {
  const [{contactSearch, contactFilter}, dispatch] = useStateProvider();
  const filters = [
    {label: "Todos", value: "all"},
    {label: "Nao lidas", value: "unread"},
    {label: "Favoritos", value: "pinned"},
    {label: "Grupos", value: "groups"},
  ];

  return( 
  <div className="bg-search-input-container-background px-4 py-3 border-b border-conversation-border">
    <div className="flex items-center gap-3">
      <div className="bg-panel-header-background flex items-center gap-4 px-4 py-2 rounded-lg flex-grow shadow-inner">
        <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-l" />
        <input
          type="text"
          placeholder="Pesquisar ou comecar uma nova conversa"
          className="bg-transparent text-sm focus:outline-none text-white w-full placeholder:text-secondary"
          value={contactSearch}
          onChange={(event) => dispatch({
            type: reducerCases.SET_CONTACT_SEARCH,
            contactSearch: event.target.value,
          })}
        />
      </div>
      <button className="h-9 w-9 rounded-full bg-panel-header-background flex items-center justify-center">
        <BsFilter className="text-panel-header-icon cursor-pointer text-lg" />
      </button>
    </div>
    <div className="flex gap-2 mt-3 overflow-x-auto custom-scrollbar pb-1">
      {filters.map((filter) => (
        <button
          key={filter.value}
          className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-colors ${contactFilter === filter.value ? "bg-icon-green text-search-input-container-background font-semibold" : "bg-panel-header-background text-secondary hover:text-primary-strong"}`}
          onClick={() => dispatch({
            type: reducerCases.SET_CONTACT_FILTER,
            contactFilter: filter.value,
          })}
        >
          {filter.label}
        </button>
      ))}
    </div>
  </div>
  );
}

export default SearchBar;
