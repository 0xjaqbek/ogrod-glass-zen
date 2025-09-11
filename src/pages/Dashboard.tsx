// src/pages/Dashboard.tsx
import { useNavigate } from "react-router-dom";
import GardenDashboard from "@/components/GardenDashboard";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleGardenSelect = () => {
    navigate("/gardens");
  };

  return <GardenDashboard onGardenSelect={handleGardenSelect} />;
};

export default Dashboard;