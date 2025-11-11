import type { Trainer } from '../types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TrainerCard from './TrainerCard';

interface TrainersListProps {
  trainers: Trainer[];
  onDelete: (trainer: Trainer) => void;
}

export default function TrainersList({ trainers, onDelete }: TrainersListProps) {
  const [swipedTrainerId, setSwipedTrainerId] = useState<string | null>(null);
  const navigate = useNavigate();

  if (trainers.length === 0) {
    return (
      <div className="text-gray-500 text-center py-8">
        <p>No trainers added yet. Click "Add Trainer" to get started.</p>
      </div>
    );
  }

  const handleTouchStart = (trainerId: string, e: React.TouchEvent) => {
    const touch = e.touches[0];
    const startX = touch.clientX;
    
    const handleTouchMove = (moveEvent: TouchEvent) => {
      const moveTouch = moveEvent.touches[0];
      const diffX = startX - moveTouch.clientX;
      
      // If swiped left more than 50px, show delete button
      if (diffX > 50 && swipedTrainerId !== trainerId) {
        setSwipedTrainerId(trainerId);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      }
      // If swiped right more than 30px while delete button is showing, hide it
      else if (diffX < -30 && swipedTrainerId === trainerId) {
        setSwipedTrainerId(null);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      }
    };
    
    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
    
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  const handleDeleteClick = (trainer: Trainer) => {
    onDelete(trainer);
    setSwipedTrainerId(null);
  };

  const handleTrainerClick = (trainer: Trainer) => {
    navigate(`/trainers/${trainer.id}`);
  };

  // Close swipe state when clicking outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    // Only close if clicking outside of any trainer card or on the backdrop itself
    if (swipedTrainerId && (target.classList.contains('grid') || !target.closest('.trainer-card'))) {
      setSwipedTrainerId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3" onClick={handleBackdropClick}>
      {trainers.map((trainer) => (
        <div key={trainer.id} className="trainer-card">
          <TrainerCard 
            trainer={trainer}
            onClick={handleTrainerClick}
            onDelete={handleDeleteClick}
            isSwipped={swipedTrainerId === trainer.id}
            onTouchStart={(e) => handleTouchStart(trainer.id, e)}
          />
        </div>
      ))}
    </div>
  );
}