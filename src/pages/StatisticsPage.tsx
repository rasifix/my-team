export default function StatisticsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Statistics</h1>
        <p className="mt-2 text-gray-600">
          View player attendance and selection fairness metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Summary Cards */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Players</h3>
          <p className="text-2xl font-bold text-gray-900">0</p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Events</h3>
          <p className="text-2xl font-bold text-gray-900">0</p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-500">Avg Selections per Player</h3>
          <p className="text-2xl font-bold text-gray-900">0</p>
        </div>
      </div>

      {/* Player Statistics Table */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Player Statistics</h2>
        
        <div className="text-gray-500 text-center py-8">
          <p>No player data available yet. Add players and events to see statistics.</p>
        </div>
      </div>
    </div>
  );
}