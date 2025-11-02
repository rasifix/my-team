import { useState } from 'react';
import AddPlayerModal from '../components/AddPlayerModal';
import ConfirmDialog from '../components/ConfirmDialog';
import PlayersList from '../components/PlayersList';
import { usePlayers } from '../hooks/usePlayers';

export default function PlayersPage() {
  const { players, loading, error, addPlayer, updatePlayer, deletePlayer } = usePlayers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<import('../types').Player | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [playerToDelete, setPlayerToDelete] = useState<import('../types').Player | null>(null);

  const handleAddPlayer = (playerData: Omit<import('../types').Player, 'id'>) => {
    const success = addPlayer(playerData);
    if (success) {
      setIsModalOpen(false);
    }
  };

  const handleEditPlayer = (player: import('../types').Player) => {
    setEditingPlayer(player);
    setIsModalOpen(true);
  };

  const handleUpdatePlayer = (playerId: string, playerData: Omit<import('../types').Player, 'id'>) => {
    const success = updatePlayer(playerId, playerData);
    if (success) {
      setIsModalOpen(false);
      setEditingPlayer(null);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPlayer(null);
  };

  const handleDeletePlayer = (player: import('../types').Player) => {
    setPlayerToDelete(player);
    setIsConfirmDialogOpen(true);
  };

  const confirmDeletePlayer = () => {
    if (playerToDelete) {
      deletePlayer(playerToDelete.id);
      setPlayerToDelete(null);
    }
    setIsConfirmDialogOpen(false);
  };

  const cancelDeletePlayer = () => {
    setPlayerToDelete(null);
    setIsConfirmDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-8">
          <p className="text-gray-600">Loading players...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Players</h1>
        <p className="mt-2 text-gray-600">
          Manage your soccer players, their scores, and information.
        </p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">All Players</h2>
          <button 
            onClick={() => {
              setEditingPlayer(null);
              setIsModalOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Add Player
          </button>
        </div>
        
        <PlayersList
          players={players}
          onEdit={handleEditPlayer}
          onDelete={handleDeletePlayer}
        />
      </div>

      <AddPlayerModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleAddPlayer}
        onUpdate={handleUpdatePlayer}
        editingPlayer={editingPlayer}
      />

      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        title="Delete Player"
        message={`Are you sure you want to delete ${playerToDelete?.firstName} ${playerToDelete?.lastName}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDeletePlayer}
        onCancel={cancelDeletePlayer}
        confirmButtonColor="red"
      />
    </div>
  );
}