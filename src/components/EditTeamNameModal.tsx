import { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter } from './ui';
import Button from './ui/Button';

interface EditTeamNameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  currentName: string;
}

export default function EditTeamNameModal({ 
  isOpen, 
  onClose, 
  onSave, 
  currentName 
}: EditTeamNameModalProps) {
  const [teamName, setTeamName] = useState(currentName);

  useEffect(() => {
    setTeamName(currentName);
  }, [currentName, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (teamName.trim()) {
      onSave(teamName.trim());
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>
        <ModalTitle>Edit Team Name</ModalTitle>
      </ModalHeader>

      <form onSubmit={handleSubmit}>
        <ModalBody>
          <div>
            <label htmlFor="teamName" className="form-label">
              Team Name
            </label>
            <input
              type="text"
              id="teamName"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              required
              className="form-input"
              placeholder="Enter team name"
              autoFocus
            />
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
            Save
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
