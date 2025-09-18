// src/components/ConflictResolutionModal.tsx
import React, { useState, useEffect } from 'react';
import { ConflictResolution } from '@/types/garden';
import { conflictResolutionService } from '@/lib/conflictResolutionService';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Clock, User, ChevronRight, Check, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ConflictResolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResolve: (conflictId: string, resolution: any) => void;
}

export const ConflictResolutionModal: React.FC<ConflictResolutionModalProps> = ({
  isOpen,
  onClose,
  onResolve
}) => {
  const [conflicts, setConflicts] = useState<ConflictResolution[]>([]);
  const [selectedConflict, setSelectedConflict] = useState<ConflictResolution | null>(null);
  const [resolutionTab, setResolutionTab] = useState<'local' | 'remote' | 'merge'>('local');

  // Load conflicts on mount and when modal opens
  useEffect(() => {
    if (isOpen) {
      loadConflicts();
    }
  }, [isOpen]);

  // Listen for conflict updates
  useEffect(() => {
    const handleConflictsUpdate = (updatedConflicts: ConflictResolution[]) => {
      setConflicts(updatedConflicts);

      // If selected conflict was resolved, clear selection
      if (selectedConflict && !updatedConflicts.find(c => c.id === selectedConflict.id)) {
        setSelectedConflict(null);
      }
    };

    conflictResolutionService.addConflictListener(handleConflictsUpdate);

    return () => {
      conflictResolutionService.removeConflictListener(handleConflictsUpdate);
    };
  }, [selectedConflict]);

  const loadConflicts = () => {
    const pendingConflicts = conflictResolutionService.getPendingConflicts();
    setConflicts(pendingConflicts);

    if (pendingConflicts.length > 0 && !selectedConflict) {
      setSelectedConflict(pendingConflicts[0]);
    }
  };

  const handleResolveConflict = async (resolution: 'local' | 'remote' | 'merged', mergedData?: any) => {
    if (!selectedConflict) return;

    try {
      const resolvedData = conflictResolutionService.resolveConflict(
        selectedConflict.id,
        resolution,
        mergedData
      );

      // Notify parent component
      onResolve(selectedConflict.id, resolvedData);

      // Move to next conflict or close modal
      const remainingConflicts = conflicts.filter(c => c.id !== selectedConflict.id);

      if (remainingConflicts.length > 0) {
        setSelectedConflict(remainingConflicts[0]);
      } else {
        onClose();
        toast({
          title: "Wszystkie konflikty rozwiązane",
          description: "Dane zostały pomyślnie zsynchronizowane"
        });
      }
    } catch (error) {
      console.error('Error resolving conflict:', error);
      toast({
        title: "Błąd rozwiązywania konfliktu",
        description: "Nie udało się rozwiązać konfliktu",
        variant: "destructive"
      });
    }
  };

  const formatFieldValue = (value: any): string => {
    if (value === null || value === undefined) {
      return 'brak';
    }

    if (value instanceof Date) {
      return value.toLocaleString('pl-PL');
    }

    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }

    return String(value);
  };

  const getCollectionDisplayName = (collection: string): string => {
    const names: Record<string, string> = {
      gardens: 'Ogród',
      tasks: 'Zadanie',
      notifications: 'Powiadomienie',
      activities: 'Aktywność'
    };
    return names[collection] || collection;
  };

  const renderFieldComparison = (fieldName: string, localValue: any, remoteValue: any) => {
    const isConflict = conflicts.find(c => c.id === selectedConflict?.id)?.conflictFields.includes(fieldName);

    return (
      <div key={fieldName} className={`mb-4 p-3 border rounded-lg ${isConflict ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30' : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/50'}`}>
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-sm">{fieldName}</h4>
          {isConflict && (
            <Badge variant="destructive" className="text-xs">
              Konflikt
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="text-xs text-blue-600 dark:text-blue-400 font-medium flex items-center">
              <User className="h-3 w-3 mr-1" />
              Lokalna wersja
            </div>
            <pre className="text-xs bg-blue-50 dark:bg-blue-950/30 p-2 rounded border text-gray-700 dark:text-gray-300 whitespace-pre-wrap overflow-x-auto">
              {formatFieldValue(localValue)}
            </pre>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-green-600 dark:text-green-400 font-medium flex items-center">
              <User className="h-3 w-3 mr-1" />
              Zdalna wersja
            </div>
            <pre className="text-xs bg-green-50 dark:bg-green-950/30 p-2 rounded border text-gray-700 dark:text-gray-300 whitespace-pre-wrap overflow-x-auto">
              {formatFieldValue(remoteValue)}
            </pre>
          </div>
        </div>
      </div>
    );
  };

  if (!isOpen || conflicts.length === 0) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            Rozwiązywanie konfliktów danych
            <Badge variant="destructive" className="ml-2">
              {conflicts.length}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {selectedConflict && (
          <div className="space-y-6">
            {/* Conflict Header */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  <div className="flex items-center">
                    <span>{getCollectionDisplayName(selectedConflict.collection)}</span>
                    <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      ID: {selectedConflict.documentId}
                    </span>
                  </div>
                  <Badge variant="outline" className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {new Date(selectedConflict.timestamp).toLocaleString('pl-PL')}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Konflikty w polach: {selectedConflict.conflictFields.join(', ')}
                </div>
              </CardContent>
            </Card>

            {/* Resolution Tabs */}
            <Tabs value={resolutionTab} onValueChange={(value) => setResolutionTab(value as any)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="local" className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  Lokalna wersja
                </TabsTrigger>
                <TabsTrigger value="remote" className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  Zdalna wersja
                </TabsTrigger>
                <TabsTrigger value="merge" className="flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Ręczne scalenie
                </TabsTrigger>
              </TabsList>

              <TabsContent value="local" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-600 dark:text-blue-400">
                      Użyj lokalnej wersji
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Zachowa zmiany wprowadzone lokalnie i nadpisze zmiany zdalne.
                    </p>

                    <div className="space-y-3">
                      {Object.keys(selectedConflict.localVersion).map(fieldName =>
                        renderFieldComparison(
                          fieldName,
                          selectedConflict.localVersion[fieldName],
                          selectedConflict.remoteVersion[fieldName]
                        )
                      )}
                    </div>

                    <Separator className="my-4" />

                    <Button
                      onClick={() => handleResolveConflict('local')}
                      className="w-full"
                      variant="default"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Użyj lokalnej wersji
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="remote" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-green-600 dark:text-green-400">
                      Użyj zdalnej wersji
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Zachowa zmiany ze zdalnego serwera i nadpisze zmiany lokalne.
                    </p>

                    <div className="space-y-3">
                      {Object.keys(selectedConflict.remoteVersion).map(fieldName =>
                        renderFieldComparison(
                          fieldName,
                          selectedConflict.localVersion[fieldName],
                          selectedConflict.remoteVersion[fieldName]
                        )
                      )}
                    </div>

                    <Separator className="my-4" />

                    <Button
                      onClick={() => handleResolveConflict('remote')}
                      className="w-full"
                      variant="default"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Użyj zdalnej wersji
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="merge" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-orange-600 dark:text-orange-400">
                      Ręczne scalenie
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Wybierz najlepsze wartości z obu wersji lub wprowadź własne.
                    </p>

                    <div className="space-y-3">
                      {Object.keys(selectedConflict.localVersion).map(fieldName =>
                        renderFieldComparison(
                          fieldName,
                          selectedConflict.localVersion[fieldName],
                          selectedConflict.remoteVersion[fieldName]
                        )
                      )}
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-2">
                      <Button
                        onClick={() => {
                          const autoMerged = conflictResolutionService.autoMergeChanges(
                            selectedConflict.localVersion,
                            selectedConflict.remoteVersion
                          );

                          if (autoMerged) {
                            handleResolveConflict('merged', autoMerged);
                          } else {
                            toast({
                              title: "Automatyczne scalenie niemożliwe",
                              description: "Wybierz lokalną lub zdalną wersję",
                              variant: "destructive"
                            });
                          }
                        }}
                        className="w-full"
                        variant="default"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Automatyczne scalenie
                      </Button>

                      <p className="text-xs text-gray-500 text-center">
                        Automatyczne scalenie próbuje połączyć zmiany z obu wersji
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Konflikt {conflicts.findIndex(c => c.id === selectedConflict.id) + 1} z {conflicts.length}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  onClick={onClose}
                  variant="outline"
                  size="sm"
                >
                  <X className="h-4 w-4 mr-1" />
                  Anuluj
                </Button>

                {conflicts.length > 1 && (
                  <Button
                    onClick={() => {
                      const currentIndex = conflicts.findIndex(c => c.id === selectedConflict.id);
                      const nextIndex = (currentIndex + 1) % conflicts.length;
                      setSelectedConflict(conflicts[nextIndex]);
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Następny konflikt
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ConflictResolutionModal;