import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Calendar } from "lucide-react";
import { useGarden } from "@/contexts/GardenContext";
import { toast } from "@/hooks/use-toast";

// Proper React Error Boundary class component
class SelectErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Select Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-2 border border-red-200 bg-red-50 rounded text-red-600 text-sm">
            Błąd ładowania opcji
          </div>
        )
      );
    }

    return this.props.children;
  }
}

// Safe Select wrapper component
const SafeSelect = ({ 
  value, 
  onValueChange, 
  children, 
  placeholder,
  className 
}: {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  placeholder?: string;
  className?: string;
}) => {
  return (
    <SelectErrorBoundary>
      <Select value={value || ""} onValueChange={onValueChange}>
        <SelectTrigger className={className}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className={className}>
          {children}
        </SelectContent>
      </Select>
    </SelectErrorBoundary>
  );
};

// Safe SelectItem wrapper
const SafeSelectItem = ({ 
  value, 
  children 
}: { 
  value: string; 
  children: React.ReactNode 
}) => {
  // Don't render if value is null, undefined, or empty
  if (!value || value === null || value === undefined) {
    return null;
  }
  
  return (
    <SelectItem value={value}>
      {children}
    </SelectItem>
  );
};

const CreateTaskPage = () => {
  const navigate = useNavigate();
  const { state, addTask } = useGarden();
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'other' as 'watering' | 'fertilizing' | 'harvesting' | 'pruning' | 'other',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: '',
    gardenId: '',
    bedId: '',
    plantId: '',
  });

  // Safety checks for data with additional validation
  const safeGardens = (state?.gardens || []).filter(g => g && g.id && g.name);
  const selectedGarden = formData.gardenId ? safeGardens.find(g => g.id === formData.gardenId) : null;
  const safeBeds = (selectedGarden?.beds || []).filter(b => b && b.id && b.name);
  const selectedBed = selectedGarden && formData.bedId ? safeBeds.find(b => b.id === formData.bedId) : null;
  const availablePlants = (selectedBed?.plants || []).filter(p => p && p.id && p.name);

  const taskTypes = [
    { value: 'watering', label: 'Podlewanie', icon: '💧' },
    { value: 'fertilizing', label: 'Nawożenie', icon: '🌱' },
    { value: 'harvesting', label: 'Zbiory', icon: '🥕' },
    { value: 'pruning', label: 'Przycinanie', icon: '✂️' },
    { value: 'other', label: 'Inne', icon: '📝' },
  ];

  const priorities = [
    { value: 'low', label: 'Niski', color: 'text-green-600' },
    { value: 'medium', label: 'Średni', color: 'text-yellow-600' },
    { value: 'high', label: 'Wysoki', color: 'text-red-600' },
  ];

  // Set default due date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDate = tomorrow.toISOString().split('T')[0];

  // Clean up invalid state and handle loading
  useEffect(() => {
    if (!state) return;

    // Add a small delay to ensure data is fully loaded
    const timer = setTimeout(() => {
      // Validate and clean form data
      setFormData(prev => {
        const validGarden = prev.gardenId && safeGardens.find(g => g.id === prev.gardenId);
        const validBed = validGarden && prev.bedId && validGarden.beds?.find(b => b && b.id === prev.bedId);
        const validPlant = validBed && prev.plantId && validBed.plants?.find(p => p && p.id === prev.plantId);

        return {
          ...prev,
          gardenId: validGarden ? prev.gardenId : '',
          bedId: validBed ? prev.bedId : '',
          plantId: validPlant ? prev.plantId : '',
        };
      });

      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [state, safeGardens]);

  const handleSubmit = () => {
    if (!formData.title.trim() || !formData.dueDate || !formData.gardenId) {
      toast({
        title: "Błąd",
        description: "Wypełnij wymagane pola: tytuł, termin i ogród",
        variant: "destructive",
      });
      return;
    }

    try {
      addTask({
        title: formData.title.trim(),
        description: formData.description.trim(),
        type: formData.type,
        priority: formData.priority,
        dueDate: new Date(formData.dueDate),
        gardenId: formData.gardenId,
        bedId: formData.bedId || undefined,
        plantId: formData.plantId || undefined,
        completed: false,
      });
      
      toast({
        title: "Zadanie dodane! 📝",
        description: `Utworzono zadanie: ${formData.title}`,
      });
      
      navigate('/tasks');
    } catch (error) {
      console.error('Error adding task:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się dodać zadania. Spróbuj ponownie.",
        variant: "destructive",
      });
    }
  };

  const handleGardenChange = (gardenId: string) => {
    if (gardenId && typeof gardenId === 'string') {
      setFormData(prev => ({
        ...prev,
        gardenId,
        bedId: '',
        plantId: '',
      }));
    }
  };

  const handleBedChange = (bedId: string) => {
    if (bedId !== undefined) {
      setFormData(prev => ({
        ...prev,
        bedId: bedId || '',
        plantId: '',
      }));
    }
  };

  // Loading state
  if (isLoading || !state) {
    return (
      <div className="min-h-screen p-3 sm:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p>Ładowanie...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/tasks')}
          className="glass-button h-8 w-8 sm:h-10 sm:w-10"
        >
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
        <div className="min-w-0 flex-1">
          <h1 className="text-lg sm:text-2xl font-bold text-foreground">Nowe Zadanie</h1>
          <p className="text-sm sm:text-base text-foreground-secondary">
            Dodaj nowe zadanie do swojego ogrodu
          </p>
        </div>
      </div>

      {/* Form */}
      <Card className="glass rounded-xl p-3 sm:p-6">
        <div className="space-y-4">
          {/* Basic Info */}
          <div>
            <Label htmlFor="task-title">Tytuł zadania *</Label>
            <Input
              id="task-title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="np. Podlej pomidory"
              className="glass"
            />
          </div>
          
          <div>
            <Label htmlFor="task-description">Opis</Label>
            <Textarea
              id="task-description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Dodatkowe informacje o zadaniu..."
              className="glass"
              rows={3}
            />
          </div>

          {/* Task Type and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="task-type">Typ zadania</Label>
              <SafeSelect
                value={formData.type}
                onValueChange={(value: string) => {
                  if (value && ['watering', 'fertilizing', 'harvesting', 'pruning', 'other'].includes(value)) {
                    setFormData(prev => ({ ...prev, type: value as any }));
                  }
                }}
                className="glass"
              >
                {taskTypes.map((type) => (
                  <SafeSelectItem key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </SafeSelectItem>
                ))}
              </SafeSelect>
            </div>

            <div>
              <Label htmlFor="task-priority">Priorytet</Label>
              <SafeSelect
                value={formData.priority}
                onValueChange={(value: string) => {
                  if (value && ['low', 'medium', 'high'].includes(value)) {
                    setFormData(prev => ({ ...prev, priority: value as any }));
                  }
                }}
                className="glass"
              >
                {priorities.map((priority) => (
                  <SafeSelectItem key={priority.value} value={priority.value}>
                    <span className={priority.color}>{priority.label}</span>
                  </SafeSelectItem>
                ))}
              </SafeSelect>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <Label htmlFor="task-due-date">Termin wykonania *</Label>
            <div className="relative">
              <Input
                id="task-due-date"
                type="date"
                value={formData.dueDate || defaultDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                className="glass"
                min={new Date().toISOString().split('T')[0]}
              />
              <Calendar className="absolute right-3 top-3 h-4 w-4 text-foreground-secondary pointer-events-none" />
            </div>
          </div>

          {/* Garden Selection */}
          <div>
            <Label htmlFor="task-garden">Ogród *</Label>
            <SafeSelect
              value={formData.gardenId}
              onValueChange={handleGardenChange}
              placeholder="Wybierz ogród"
              className="glass"
            >
              {safeGardens.length > 0 ? (
                safeGardens.map((garden) => (
                  <SafeSelectItem key={garden.id} value={garden.id}>
                    🌱 {garden.name}
                  </SafeSelectItem>
                ))
              ) : (
                <SafeSelectItem value="" disabled>
                  Brak dostępnych ogrodów
                </SafeSelectItem>
              )}
            </SafeSelect>
          </div>

          {/* Bed Selection */}
          {selectedGarden && safeBeds.length > 0 && (
            <div>
              <Label htmlFor="task-bed">Grządka (opcjonalnie)</Label>
              <SafeSelect
                value={formData.bedId}
                onValueChange={handleBedChange}
                placeholder="Wybierz grządkę"
                className="glass"
              >
                <SafeSelectItem value="">Brak wyboru</SafeSelectItem>
                {safeBeds.map((bed) => (
                  <SafeSelectItem key={bed.id} value={bed.id}>
                    🌿 {bed.name}
                  </SafeSelectItem>
                ))}
              </SafeSelect>
            </div>
          )}

          {/* Plant Selection */}
          {availablePlants.length > 0 && (
            <div>
              <Label htmlFor="task-plant">Roślina (opcjonalnie)</Label>
              <SafeSelect
                value={formData.plantId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, plantId: value || '' }))}
                placeholder="Wybierz roślinę"
                className="glass"
              >
                <SafeSelectItem value="">Brak wyboru</SafeSelectItem>
                {availablePlants.map((plant) => (
                  <SafeSelectItem key={plant.id} value={plant.id}>
                    {plant.emoji || '🌱'} {plant.name}
                  </SafeSelectItem>
                ))}
              </SafeSelect>
            </div>
          )}

          {/* Preview Card */}
          {formData.title && (
            <Card className="bg-emerald/10 border-emerald/20 p-3">
              <h3 className="font-medium text-foreground mb-2">Podgląd zadania:</h3>
              <div className="space-y-1">
                <p className="font-medium">{formData.title}</p>
                {formData.description && (
                  <p className="text-sm text-foreground-secondary">{formData.description}</p>
                )}
                <div className="flex items-center space-x-2 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    formData.priority === 'high' ? 'bg-red-100 text-red-800' :
                    formData.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {priorities.find(p => p.value === formData.priority)?.label}
                  </span>
                  <span className="text-foreground-secondary">
                    {taskTypes.find(t => t.value === formData.type)?.label}
                  </span>
                  {formData.dueDate && (
                    <span className="text-foreground-secondary">
                      {new Date(formData.dueDate).toLocaleDateString('pl-PL')}
                    </span>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* Form Actions */}
          <div className="flex space-x-2 pt-4">
            <Button 
              onClick={handleSubmit} 
              className="flex-1"
              disabled={!formData.title.trim() || !formData.dueDate || !formData.gardenId}
            >
              Dodaj zadanie
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/tasks')}
              className="flex-1"
            >
              Anuluj
            </Button>
          </div>
        </div>
      </Card>

      {/* Helper Info */}
      {safeGardens.length === 0 && (
        <Card className="glass rounded-xl p-4 border-yellow-200 bg-yellow-50">
          <div className="flex items-start space-x-3">
            <div className="text-yellow-600">⚠️</div>
            <div>
              <p className="font-medium text-yellow-800">Brak ogrodów</p>
              <p className="text-sm text-yellow-700 mt-1">
                Aby dodać zadanie, musisz najpierw utworzyć ogród.
              </p>
              <Button 
                size="sm" 
                className="mt-2"
                onClick={() => navigate('/gardens/new')}
              >
                Utwórz ogród
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CreateTaskPage;