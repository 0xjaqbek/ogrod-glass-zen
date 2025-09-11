import { useState } from "react";
import GardenDashboard from "@/components/GardenDashboard";
import NavigationBar from "@/components/NavigationBar";
import GardenDetail from "@/components/GardenDetail";
import BedDetail from "@/components/BedDetail";
import PlantDetail from "@/components/PlantDetail";
import HistoryScreen from "@/components/HistoryScreen";
import NotificationsScreen from "@/components/NotificationsScreen";
import SettingsScreen from "@/components/SettingsScreen";

type Screen = "dashboard" | "garden" | "history" | "notifications" | "settings";
type DetailScreen = "garden-detail" | "bed-detail" | "plant-detail";

const Index = () => {
  const [activeTab, setActiveTab] = useState<Screen>("dashboard");
  const [detailScreen, setDetailScreen] = useState<DetailScreen | null>(null);
  const [selectedBedId, setSelectedBedId] = useState<string>("");
  const [selectedPlantId, setSelectedPlantId] = useState<string>("");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as Screen);
    setDetailScreen(null);
  };

  const handleGardenSelect = () => {
    setDetailScreen("garden-detail");
  };

  const handleBedSelect = (bedId: string) => {
    setSelectedBedId(bedId);
    setDetailScreen("bed-detail");
  };

  const handlePlantSelect = (plantId: string) => {
    setSelectedPlantId(plantId);
    setDetailScreen("plant-detail");
  };

  const handleBack = () => {
    if (detailScreen === "plant-detail") {
      setDetailScreen("bed-detail");
    } else if (detailScreen === "bed-detail") {
      setDetailScreen("garden-detail");
    } else if (detailScreen === "garden-detail") {
      setDetailScreen(null);
      setActiveTab("dashboard");
    }
  };

  const renderContent = () => {
    if (detailScreen === "garden-detail") {
      return <GardenDetail onBack={handleBack} onBedSelect={handleBedSelect} />;
    }

    if (detailScreen === "bed-detail") {
      return <BedDetail bedId={selectedBedId} onBack={handleBack} onPlantSelect={handlePlantSelect} />;
    }

    if (detailScreen === "plant-detail") {
      return <PlantDetail plantId={selectedPlantId} onBack={handleBack} />;
    }

    switch (activeTab) {
      case "dashboard":
        return <GardenDashboard onGardenSelect={handleGardenSelect} />;
      case "garden":
        return <GardenDetail onBack={() => setActiveTab("dashboard")} onBedSelect={handleBedSelect} />;
      case "history":
        return <HistoryScreen />;
      case "notifications":
        return <NotificationsScreen />;
      case "settings":
        return <SettingsScreen />;
      default:
        return <GardenDashboard onGardenSelect={handleGardenSelect} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="pb-16 sm:pb-24">
        {renderContent()}
      </main>

      {/* Navigation Bar */}
      <NavigationBar activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};

export default Index;