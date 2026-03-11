import React from 'react';
import { Play } from '@/data/plays';
import TacticalPitch from './TacticalPitch';
import { X } from 'lucide-react';

interface CompareBarProps {
  selected: Play[];
  onRemove: (id: string) => void;
  onCompare: () => void;
  onCancel: () => void;
}

const CompareBar: React.FC<CompareBarProps> = ({ selected, onRemove, onCompare, onCancel }) => {
  if (selected.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-primary" style={{ backgroundColor: 'hsl(0, 0%, 6.7%)' }}>
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm text-foreground font-medium">{selected.length} jugada{selected.length > 1 ? 's' : ''} seleccionada{selected.length > 1 ? 's' : ''}</span>
          <div className="flex gap-2">
            {selected.map(p => (
              <div key={p.id} className="relative w-16 h-12 rounded overflow-hidden border border-border">
                <TacticalPitch jugadores={p.jugadores} size="sm" />
                <button
                  onClick={() => onRemove(p.id)}
                  className="absolute -top-1 -right-1 bg-background rounded-full p-0.5"
                >
                  <X size={10} className="text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onCancel} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ✕ Cancelar
          </button>
          <button
            onClick={onCompare}
            disabled={selected.length < 2}
            className="bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            Comparar jugadas →
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompareBar;
