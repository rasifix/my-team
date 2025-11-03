import { useState } from 'react';
import AddPlayerModal from '../components/AddPlayerModal';
import ConfirmDialog from '../components/ConfirmDialog';
import PlayersList from '../components/PlayersList';
import { usePlayers } from '../hooks/usePlayers';
import { Card, CardBody, CardTitle } from '../components/ui';
import Button from '../components/ui/Button';

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
      <div className="page-container">
        <div className="empty-state">
          <p>Loading players...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Players</h1>
        <p className="page-subtitle">
          Manage your soccer players, their levels, and information.
        </p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <Card>
        <CardBody>
          <div className="flex justify-between items-center mb-4">
            <CardTitle>All Players</CardTitle>
            <Button 
              variant="primary"
              onClick={() => {
                setEditingPlayer(null);
                setIsModalOpen(true);
              }}
            >
              Add Player
            </Button>
          </div>
        
          <PlayersList
            players={players}
            onEdit={handleEditPlayer}
            onDelete={handleDeletePlayer}
          />
        </CardBody>
      </Card>

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