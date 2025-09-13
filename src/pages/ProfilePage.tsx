import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Edit2, Save, X, Calendar, Sprout, CheckCircle, Award } from "lucide-react";
import { useGarden } from "@/contexts/GardenContext";
import { toast } from "@/hooks/use-toast";

const ProfilePage = () => {
  const { state } = useGarden();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Ogrodnik",
    email: "ogrodnik@example.com",
    bio: "Pasjonat ogrodnictwa i zrównoważonego życia.",
    location: "Polska",
    experience: "Początkujący",
    favoriteElements: ["Warzywa", "Zioła", "Kwiaty"],
  });

  const [editForm, setEditForm] = useState(profile);

  const handleSave = () => {
    setProfile(editForm);
    setIsEditing(false);
    toast({
      title: "Profil zaktualizowany! ✅",
      description: "Twoje dane zostały pomyślnie zapisane",
    });
  };

  const handleCancel = () => {
    setEditForm(profile);
    setIsEditing(false);
  };

  // Calculate stats
  const totalGardens = state.gardens.length;
  const totalBeds = state.gardens.reduce((sum, garden) => sum + garden.beds.length, 0);
  const totalPlants = state.gardens.reduce((sum, garden) => 
    sum + garden.beds.reduce((bedSum, bed) => bedSum + bed.plants.length, 0), 0
  );
  const completedTasks = state.tasks.filter(task => task.completed).length;
  const totalActivities = state.activities.length;

  // Calculate achievements
  const achievements = [
    { 
      id: 'first_garden', 
      title: 'Pierwszy Ogród', 
      description: 'Utworzyłeś pierwszy ogród',
      earned: totalGardens >= 1,
      icon: '🌱'
    },
    { 
      id: 'plant_lover', 
      title: 'Miłośnik Roślin', 
      description: 'Posadź 10 roślin',
      earned: totalPlants >= 10,
      icon: '🌿'
    },
    { 
      id: 'task_master', 
      title: 'Mistrz Zadań', 
      description: 'Ukończ 25 zadań',
      earned: completedTasks >= 25,
      icon: '✅'
    },
    { 
      id: 'gardener', 
      title: 'Ogrodnik', 
      description: 'Miej aktywne 3 ogrody',
      earned: totalGardens >= 3,
      icon: '🏡'
    },
    { 
      id: 'active_user', 
      title: 'Aktywny Użytkownik', 
      description: 'Wykonaj 100 aktywności',
      earned: totalActivities >= 100,
      icon: '🏆'
    }
  ];

  const earnedAchievements = achievements.filter(a => a.earned);
  const remainingAchievements = achievements.filter(a => !a.earned);

  const experienceLevels = [
    { value: 'Początkujący', label: 'Początkujący', color: 'bg-green-100 text-green-800' },
    { value: 'Średniozaawansowany', label: 'Średniozaawansowany', color: 'bg-blue-100 text-blue-800' },
    { value: 'Zaawansowany', label: 'Zaawansowany', color: 'bg-purple-100 text-purple-800' },
    { value: 'Ekspert', label: 'Ekspert', color: 'bg-yellow-100 text-yellow-800' },
  ];

  const currentLevel = experienceLevels.find(level => level.value === profile.experience) || experienceLevels[0];

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold text-foreground">Mój Profil</h1>
          <p className="text-sm sm:text-base text-foreground-secondary">
            Zarządzaj swoimi danymi i zobacz swoje osiągnięcia
          </p>
        </div>
        {!isEditing ? (
          <Button 
            onClick={() => setIsEditing(true)}
            variant="outline" 
            size="icon" 
            className="glass-button emerald-glow h-8 w-8 sm:h-10 sm:w-10"
          >
            <Edit2 className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button 
              onClick={handleSave}
              size="sm"
              className="emerald-glow"
            >
              <Save className="h-4 w-4 mr-1" />
              Zapisz
            </Button>
            <Button 
              onClick={handleCancel}
              variant="outline" 
              size="sm"
              className="glass-button"
            >
              <X className="h-4 w-4 mr-1" />
              Anuluj
            </Button>
          </div>
        )}
      </div>

      {/* Profile Info */}
      <Card className="glass rounded-xl p-4 sm:p-6">
        <div className="flex items-start space-x-4">
          <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
            <AvatarFallback className="bg-emerald/20 text-emerald text-xl font-bold">
              <User className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-4">
            {!isEditing ? (
              <>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">{profile.name}</h2>
                  <p className="text-foreground-secondary">{profile.email}</p>
                  <Badge className={`mt-2 ${currentLevel.color}`}>
                    {currentLevel.label}
                  </Badge>
                </div>
                <p className="text-foreground-secondary">{profile.bio}</p>
                <div className="flex items-center text-sm text-foreground-secondary">
                  <span>📍 {profile.location}</span>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Imię</Label>
                    <Input
                      id="name"
                      value={editForm.name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                      className="glass"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                      className="glass"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="bio">Opis</Label>
                  <Textarea
                    id="bio"
                    value={editForm.bio}
                    onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                    className="glass"
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Lokalizacja</Label>
                    <Input
                      id="location"
                      value={editForm.location}
                      onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                      className="glass"
                    />
                  </div>
                  <div>
                    <Label htmlFor="experience">Doświadczenie</Label>
                    <select
                      id="experience"
                      value={editForm.experience}
                      onChange={(e) => setEditForm(prev => ({ ...prev, experience: e.target.value }))}
                      className="w-full p-2 rounded-md border border-border bg-background"
                    >
                      {experienceLevels.map(level => (
                        <option key={level.value} value={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Stats */}
      <Card className="glass rounded-xl p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Statystyki</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald">{totalGardens}</div>
            <div className="text-xs sm:text-sm text-foreground-secondary">Ogrody</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald">{totalBeds}</div>
            <div className="text-xs sm:text-sm text-foreground-secondary">Grządki</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald">{totalPlants}</div>
            <div className="text-xs sm:text-sm text-foreground-secondary">Rośliny</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald">{completedTasks}</div>
            <div className="text-xs sm:text-sm text-foreground-secondary">Zadania</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald">{totalActivities}</div>
            <div className="text-xs sm:text-sm text-foreground-secondary">Aktywności</div>
          </div>
        </div>
      </Card>

      {/* Achievements */}
      <Card className="glass rounded-xl p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Osiągnięcia ({earnedAchievements.length}/{achievements.length})
        </h3>
        
        {/* Earned Achievements */}
        {earnedAchievements.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-foreground mb-3 flex items-center">
              <Award className="h-4 w-4 mr-2 text-yellow-500" />
              Zdobyte
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {earnedAchievements.map((achievement) => (
                <div 
                  key={achievement.id} 
                  className="flex items-center space-x-3 p-3 rounded-lg bg-yellow-50 border border-yellow-200"
                >
                  <div className="text-2xl">{achievement.icon}</div>
                  <div>
                    <p className="font-medium text-yellow-800">{achievement.title}</p>
                    <p className="text-xs text-yellow-600">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Remaining Achievements */}
        {remainingAchievements.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3 flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-gray-400" />
              Do zdobycia
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {remainingAchievements.map((achievement) => (
                <div 
                  key={achievement.id} 
                  className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 border border-gray-200 opacity-60"
                >
                  <div className="text-2xl grayscale">{achievement.icon}</div>
                  <div>
                    <p className="font-medium text-gray-700">{achievement.title}</p>
                    <p className="text-xs text-gray-500">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Favorite Plants */}
      <Card className="glass rounded-xl p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Ulubione elementy</h3>
        <div className="flex flex-wrap gap-2">
          {profile.favoriteElements.map((element, index) => (
            <Badge key={index} variant="outline" className="bg-emerald/10 text-emerald border-emerald/20">
              {element}
            </Badge>
          ))}
        </div>
      </Card>

      {/* Account Info */}
      <Card className="glass rounded-xl p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Informacje o koncie</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-foreground-secondary">Data dołączenia:</span>
            <span className="text-foreground">Styczeń 2024</span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground-secondary">Ostatnia aktywność:</span>
            <span className="text-foreground">Dzisiaj</span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground-secondary">Wersja aplikacji:</span>
            <span className="text-foreground">1.0.0</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;