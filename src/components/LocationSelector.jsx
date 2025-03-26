const LocationSelector = ({ locations, selectedLocation, onChange, label }) => {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <select
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedLocation?.id || ''}
          onChange={(e) => {
            const selected = locations.find(loc => loc.id === parseInt(e.target.value));
            onChange(selected);
          }}
        >
          <option value="">Select a location</option>
          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </select>
      </div>
    );
  };
  
  export default LocationSelector;