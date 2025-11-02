import { useEffect, useState } from 'react';
import { getPlayers, getEvents } from '../utils/localStorage';
import type { Player } from '../types';

interface PlayerStats {
  player: Player;
  invitedCount: number;
  acceptedCount: number;
  selectedCount: number;
  acceptanceRate: number;
  selectionRate: number;
}

export default function StatisticsPage() {
  const [playerStats, setPlayerStats] = useState<PlayerStats[]>([]);

  useEffect(() => {
    const players = getPlayers();
    const events = getEvents();

    const stats: PlayerStats[] = players.map(player => {
      // Count invitations
      const invitedCount = events.filter(event =>
        event.invitations.some(inv => inv.playerId === player.id)
      ).length;

      // Count accepted invitations
      const acceptedCount = events.filter(event =>
        event.invitations.some(inv => inv.playerId === player.id && inv.status === 'accepted')
      ).length;

      // Count selections (player assigned to a team)
      const selectedCount = events.filter(event =>
        event.teams.some(team => (team.selectedPlayers || []).includes(player.id))
      ).length;

      const acceptanceRate = invitedCount > 0 ? (acceptedCount / invitedCount) * 100 : 0;
      const selectionRate = acceptedCount > 0 ? (selectedCount / acceptedCount) * 100 : 0;

      return {
        player,
        invitedCount,
        acceptedCount,
        selectedCount,
        acceptanceRate,
        selectionRate,
      };
    });

    // Sort by invited count (descending)
    stats.sort((a, b) => b.invitedCount - a.invitedCount);

    setPlayerStats(stats);
  }, []);

  const totalPlayers = playerStats.length;
  const totalEvents = getEvents().length;
  const avgSelections = totalPlayers > 0
    ? playerStats.reduce((sum, stat) => sum + stat.selectedCount, 0) / totalPlayers
    : 0;

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
          <p className="text-2xl font-bold text-gray-900">{totalPlayers}</p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Events</h3>
          <p className="text-2xl font-bold text-gray-900">{totalEvents}</p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-500">Avg Selections per Player</h3>
          <p className="text-2xl font-bold text-gray-900">{avgSelections.toFixed(1)}</p>
        </div>
      </div>

      {/* Player Statistics Table */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Player Statistics</h2>
        
        {playerStats.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            <p>No player data available yet. Add players and events to see statistics.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Player
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invited
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Accepted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Selected
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acceptance Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Selection Rate
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {playerStats.map((stat) => (
                  <tr key={stat.player.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {stat.player.firstName} {stat.player.lastName}
                      </div>
                      <div className="text-xs text-gray-500">
                        Skill: {stat.player.score} | {stat.player.birthYear}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {stat.invitedCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {stat.acceptedCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="font-semibold">{stat.selectedCount}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {stat.acceptanceRate.toFixed(0)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {stat.selectionRate.toFixed(0)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}