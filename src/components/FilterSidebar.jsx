function FilterSidebar({ filters, onFilterChange }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Filters</h3>
      
      {/* Price Range */}
      <div className="mb-6">
        <h4 className="font-medium mb-2">Price Range</h4>
        <select 
          className="w-full p-2 border rounded-md"
          onChange={(e) => onFilterChange('priceRange', e.target.value)}
          value={filters.priceRange}
        >
          <option value="">All Prices</option>
          <option value="0-25">$0 - $25</option>
          <option value="25-50">$25 - $50</option>
          <option value="50-100">$50 - $100</option>
          <option value="100+">$100+</option>
        </select>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h4 className="font-medium mb-2">Categories</h4>
        <div className="space-y-2">
          {['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy'].map(category => (
            <label key={category} className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox text-primary"
                checked={filters.categories?.includes(category)}
                onChange={(e) => {
                  const newCategories = e.target.checked
                    ? [...(filters.categories || []), category]
                    : (filters.categories || []).filter(c => c !== category);
                  onFilterChange('categories', newCategories);
                }}
              />
              <span className="ml-2">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Sort By */}
      <div className="mb-6">
        <h4 className="font-medium mb-2">Sort By</h4>
        <select 
          className="w-full p-2 border rounded-md"
          onChange={(e) => onFilterChange('sortBy', e.target.value)}
          value={filters.sortBy}
        >
          <option value="popular">Most Popular</option>
          <option value="newest">Newest</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
}

export default FilterSidebar;