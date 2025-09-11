// src/pages/PlantDetailPage.tsx
import { useParams, useNavigate } from "react-router-dom";
import PlantDetail from "@/components/PlantDetail";

const PlantDetailPage = () => {
  const { gardenId, bedId, plantId } = useParams<{ gardenId: string; bedId: string; plantId: string }>();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(`/gardens/${gardenId}/beds/${bedId}`);
  };

  if (!plantId) {
    navigate('/gardens');
    return <div>Loading...</div>;
  }

  return <PlantDetail plantId={plantId} onBack={handleBack} />;
};

export default PlantDetailPage;