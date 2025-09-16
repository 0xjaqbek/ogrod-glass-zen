import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useRegisterSW } from 'virtual:pwa-register/react';

export function UpdateModal() {
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered:', r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  useEffect(() => {
    if (needRefresh) {
      setShowUpdateModal(true);
    }
  }, [needRefresh]);

  const handleUpdate = () => {
    updateServiceWorker(true);
    setShowUpdateModal(false);
  };

  const handleLater = () => {
    setShowUpdateModal(false);
    setNeedRefresh(false);
  };

  if (!showUpdateModal) return null;

  return (
    <Dialog open={showUpdateModal} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Dostępna aktualizacja</DialogTitle>
          <DialogDescription>
            Nowa wersja aplikacji jest dostępna. Czy chcesz zaktualizować aplikację teraz?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleLater}>
            Później
          </Button>
          <Button onClick={handleUpdate}>
            Zaktualizuj teraz
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}