import { useState, useEffect } from 'react';
import type { Player } from '../types';
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter } from './ui';
import Button from './ui/Button';

interface AddPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (player: Omit<Player, 'id'>) => void;
  onUpdate?: (playerId: string, player: Omit<Player, 'id'>) => void;
  editingPlayer?: Player | null;
}

export default function AddPlayerModal({ isOpen, onClose, onSave, onUpdate, editingPlayer }: AddPlayerModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    level: 3
  });

  const isEditMode = Boolean(editingPlayer);

  // Load player data when editing
  useEffect(() => {
    if (editingPlayer) {
      setFormData({
        firstName: editingPlayer.firstName,
        lastName: editingPlayer.lastName,
        birthDate: editingPlayer.birthDate || '',
        level: editingPlayer.level
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        birthDate: '',
        level: 3
      });
    }
  }, [editingPlayer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.firstName.trim() && formData.lastName.trim() && formData.birthDate) {
      const birthYear = new Date(formData.birthDate).getFullYear();
      const playerData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        birthYear: birthYear,
        birthDate: formData.birthDate,
        level: formData.level
      };

      if (isEditMode && editingPlayer && onUpdate) {
        onUpdate(editingPlayer.id, playerData);
      } else {
        onSave(playerData);
      }
      
        // Reset form only if not editing
        if (!isEditMode) {
          setFormData({
            firstName: '',
            lastName: '',
            birthDate: '',
            level: 3
          });
        }
      }
    };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'level' ? parseInt(value) : value
    }));
  };  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>
        <ModalTitle>
          {isEditMode ? 'Edit Player' : 'Add New Player'}
        </ModalTitle>
      </ModalHeader>

      <form onSubmit={handleSubmit}>
        <ModalBody>
          <div className="space-y-4">
            <div>
              <label htmlFor="firstName" className="form-label">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Enter first name"
              />
            </div>

            <div>
              <label htmlFor="lastName" className="form-label">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Enter last name"
              />
            </div>

            <div>
              <label htmlFor="birthDate" className="form-label">
                Birth Date
              </label>
              <input
                type="date"
                id="birthDate"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div>
              <label htmlFor="level" className="form-label">
                Level (1-5)
              </label>
              <select
                id="level"
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="form-select"
              >
                <option value={1}>1 - Beginner</option>
                <option value={2}>2 - Novice</option>
                <option value={3}>3 - Intermediate</option>
                <option value={4}>4 - Advanced</option>
                <option value={5}>5 - Expert</option>
              </select>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
          >
            {isEditMode ? 'Update Player' : 'Add Player'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}