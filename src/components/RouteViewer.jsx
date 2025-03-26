const RouteViewer = ({ routeData }) => {
  if (!routeData) return null;

  return (
    <div className="space-y-6">
      {/* Route Summary Card */}
      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <div className="flex items-center mb-4">
          <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-800">Route Summary</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm font-medium text-blue-600 mb-1">Total Cost</p>
            <p className="text-2xl font-bold text-gray-800">{routeData.total_cost.toLocaleString()}</p>
          </div>
          <div className="bg-indigo-50 p-3 rounded-lg">
            <p className="text-sm font-medium text-indigo-600 mb-1">Segments</p>
            <p className="text-2xl font-bold text-gray-800">{routeData.route.length}</p>
          </div>
        </div>
      </div>

      {/* Route Details Card */}
      <div className="bg-white/60 p-6 rounded-xl  border border-gray-100">
        <div className="flex items-center mb-6">
          <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-800">Route Details</h2>
        </div>

        <div className="space-y-4">
          {routeData.route.map((segment, index) => (
            <div key={index} className="border-l-4 border-blue-400 px-5 py-4 hover:bg-blue-50 transition-colors duration-200 rounded-r-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium text-gray-800 flex items-center">
                    <span className="w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-800 rounded-full mr-3 text-sm">
                      {index + 1}
                    </span>
                    {segment[1]}
                  </h3>
                  <span className="text-xs text-gray-500">ID: {segment[0]}</span>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${segment[4] === 'High Risk' ? 'bg-red-100 text-red-800' :
                    segment[4] === 'Medium Risk' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                  }`}>
                  {segment[4]}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm ml-9">
                <div>
                  <p className="text-gray-500">Date</p>
                  <p className="text-gray-800 font-medium">{segment[2]}</p>
                </div>
                <div>
                  <p className="text-gray-500">Coordinates</p>
                  <p className="text-gray-800 font-medium">
                    {segment[5][0].toFixed(4)}, {segment[5][1].toFixed(4)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Difficulty</p>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${segment[6] * 10}%` }}
                      ></div>
                    </div>
                    <span className="text-gray-800 font-medium">{segment[6]}/10</span>
                  </div>
                </div>
                <div>
                  <p className="text-gray-500">Distance</p>
                  <p className="text-gray-800 font-medium">{/* Add distance data if available */}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RouteViewer;