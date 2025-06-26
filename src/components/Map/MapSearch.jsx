import React from "react";

const MapSearch = ({ handleSearch, searchTerm, setSearchTerm }) => {
  return (
    <div>
      <form onSubmit={handleSearch} className="p-4 flex gap-2">
        <input
          type="text"
          placeholder="Search by district or city"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded w-64"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default MapSearch;
