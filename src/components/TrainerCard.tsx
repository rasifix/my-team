import type { Trainer } from '../types';

interface TrainerCardProps {
  trainer: Trainer;
  onClick: (trainer: Trainer) => void;
  isSwipped: boolean;
  onTouchStart: (e: React.TouchEvent) => void;
  onDelete: (trainer: Trainer) => void;
}

export default function TrainerCard({ trainer, onClick, isSwipped, onTouchStart, onDelete }: TrainerCardProps) {
  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger navigation if clicking on delete button or during swipe
    const target = e.target as HTMLElement;
    if (target.closest('.delete-button') || isSwipped) {
      return;
    }
    onClick(trainer);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(trainer);
  };

  return (
    <div 
      className="relative overflow-hidden bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
    >
      {/* Main card content */}
      <div 
        className={`flex items-center justify-between p-3 cursor-pointer transition-transform duration-200 ${
          isSwipped ? '-translate-x-20' : 'translate-x-0'
        } active:bg-gray-50`}
        onClick={handleCardClick}
        onTouchStart={onTouchStart}
      >
        {/* Trainer info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="truncate">
              <p className="text-sm font-medium text-gray-900 truncate">
                {trainer.firstName} {trainer.lastName}
              </p>
            </div>
            {/* Chevron to indicate clickable */}
            <div className="flex items-center">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Delete button that appears on swipe */}
      <div 
        className={`absolute inset-y-0 right-0 flex items-center justify-center w-20 bg-red-600 transition-opacity duration-200 ${
          isSwipped ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <button
          className="delete-button flex items-center justify-center w-full h-full text-white font-medium"
          onClick={handleDeleteClick}
        >
          Delete
        </button>
      </div>
    </div>
  );
}