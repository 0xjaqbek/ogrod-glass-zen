// src/pages/BedDetailPage.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useGarden } from "@/contexts/GardenContext";
import BedDetail from "@/components/BedDetail";

const BedDetailPage = () => {
  const { gardenId, bedId } = useParams<{ gardenId: string; bedId: string }>();
  const { state } = useGarden();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(`/gardens/${gardenId}`);
  };

  const handlePlantSelect = (plantId: string) => {
    navigate(`/gardens/${gardenId}/beds/${bedId}/plants/${plantId}`);
  };

  if (!bedId || !gardenId) {
    navigate('/gardens');
    return <div>Loading...</div>;
  }

  return <BedDetail bedId={bedId} onBack={handleBack} onPlantSelect={handlePlantSelect} />;
};

export default BedDetailPage;