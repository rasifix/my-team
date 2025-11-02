import { useParams } from 'react-router-dom';

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Event Details</h1>
        <p className="mt-2 text-gray-600">
          Event ID: {id}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Teams Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Teams</h2>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">
              Add Team
            </button>
          </div>
          <div className="text-gray-500 text-center py-4">
            <p>No teams configured yet.</p>
          </div>
        </div>

        {/* Invitations Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Player Invitations</h2>
            <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm">
              Invite Players
            </button>
          </div>
          <div className="text-gray-500 text-center py-4">
            <p>No invitations sent yet.</p>
          </div>
        </div>

        {/* Selection Section */}
        <div className="bg-white shadow rounded-lg p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Team Selection</h2>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm">
              Auto Select
            </button>
          </div>
          <div className="text-gray-500 text-center py-4">
            <p>Configure teams and send invitations before selecting players.</p>
          </div>
        </div>
      </div>
    </div>
  );
}