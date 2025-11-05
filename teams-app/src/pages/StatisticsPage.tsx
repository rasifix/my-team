import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPlayers, getEvents } from '../utils/localStorage';
import type { Player } from '../types';
import Level from '../components/Level';
import { Card, CardBody, CardTitle, SummaryCard, SummaryCardContent } from '../components/ui';

interface PlayerStats {
  player: Player;
  invitedCount: number;
  acceptedCount: number;
  selectedCount: number;
  acceptanceRate: number;
  selectionRate: number;
}

export default function StatisticsPage() {
  const navigate = useNavigate();
  const [playerStats, setPlayerStats] = useState<PlayerStats[]>([]);

  const handlePlayerClick = (playerId: string) => {
    navigate(`/players/${playerId}`);
  };

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

    // Sort by last name, then first name
    stats.sort((a, b) => {
      const lastNameCompare = a.player.lastName.toLowerCase().localeCompare(b.player.lastName.toLowerCase());
      if (lastNameCompare !== 0) {
        return lastNameCompare;
      }
      return a.player.firstName.toLowerCase().localeCompare(b.player.firstName.toLowerCase());
    });

    setPlayerStats(stats);
  }, []);

  const totalPlayers = playerStats.length;
  const totalEvents = getEvents().length;
  const avgAcceptances = totalPlayers > 0
    ? playerStats.reduce((sum, stat) => sum + stat.acceptedCount, 0) / totalPlayers
    : 0;
  const avgSelections = totalPlayers > 0
    ? playerStats.reduce((sum, stat) => sum + stat.selectedCount, 0) / totalPlayers
    : 0;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Statistics</h1>
        <p className="page-subtitle">
          View player attendance and selection fairness metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <SummaryCard>
          <SummaryCardContent label="Total Players" value={totalPlayers} />
        </SummaryCard>
        
        <SummaryCard>
          <SummaryCardContent label="Total Events" value={totalEvents} />
        </SummaryCard>
        
        <SummaryCard>
          <SummaryCardContent label="Avg Acceptances per Player" value={avgAcceptances.toFixed(1)} />
        </SummaryCard>
        
        <SummaryCard>
          <SummaryCardContent label="Avg Selections per Player" value={avgSelections.toFixed(1)} />
        </SummaryCard>
      </div>

      <Card>
        <CardBody>
          <CardTitle>Player Statistics</CardTitle>
        
        {playerStats.length === 0 ? (
          <div className="empty-state">
            <p>No player data available yet. Add players and events to see statistics.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead className="table-header hidden md:table-header-group">
                <tr>
                  <th className="table-header-cell">Player</th>
                  <th className="table-header-cell">Invited</th>
                  <th className="table-header-cell">Accepted</th>
                  <th className="table-header-cell">Selected</th>
                  <th className="table-header-cell">Acceptance Rate</th>
                  <th className="table-header-cell">Selection Rate</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {playerStats.map((stat) => (
                  <tr 
                    key={stat.player.id} 
                    className="table-row cursor-pointer hover:bg-gray-50"
                    onClick={() => handlePlayerClick(stat.player.id)}
                  >
                    {/* Desktop view */}
                    <td className="table-cell hidden md:table-cell">
                      <div className="text-sm font-medium text-gray-900">
                        {stat.player.firstName} {stat.player.lastName}
                        <span className="text-xs text-muted m-2">{stat.player.birthYear}</span>
                      </div>
                      <div className="text-xs flex items-center gap-2">
                        <Level level={stat.player.level} className="text-xs" />
                      </div>
                    </td>
                    <td className="table-cell hidden md:table-cell">
                      {stat.invitedCount}
                    </td>
                    <td className="table-cell hidden md:table-cell">
                      {stat.acceptedCount}
                    </td>
                    <td className="table-cell hidden md:table-cell">
                      <span className="font-semibold">{stat.selectedCount}</span>
                    </td>
                    <td className="table-cell text-gray-600 hidden md:table-cell">
                      {stat.acceptanceRate.toFixed(0)}%
                    </td>
                    <td className="table-cell text-gray-600 hidden md:table-cell">
                      {stat.selectionRate.toFixed(0)}%
                    </td>
                    
                    {/* Mobile view */}
                    <td className="px-4 py-3 md:hidden" colSpan={6}>
                      <div className="text-sm font-medium text-gray-900 mb-1 text-center">
                        {stat.player.firstName} {stat.player.lastName}{' '}
                        <span className="text-xs text-muted m-2">{stat.player.birthYear}</span>{' '}
                        <Level level={stat.player.level} className="text-xs" />
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center">
                          <div className="font-semibold text-gray-900">{stat.invitedCount}</div>
                          <div className="text-muted">Invited</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-gray-900">{stat.acceptedCount} ({stat.acceptanceRate.toFixed(0)}%)</div>
                          <div className="text-muted">Accepted</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-green-600">{stat.selectedCount} ({stat.selectionRate.toFixed(0)}%)</div>
                          <div className="text-muted">Selected</div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        </CardBody>
      </Card>
    </div>
  );
}