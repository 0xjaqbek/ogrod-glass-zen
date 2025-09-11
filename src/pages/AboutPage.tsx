import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sprout, 
  Heart, 
  Users, 
  Leaf, 
  Globe, 
  Github, 
  Twitter, 
  Mail,
  Star,
  Award,
  Target
} from "lucide-react";

const AboutPage = () => {
  const features = [
    {
      icon: Sprout,
      title: "Zarządzanie ogrodami",
      description: "Twórz i organizuj swoje ogrody, grządki i rośliny w jednym miejscu"
    },
    {
      icon: Target,
      title: "Śledzenie zadań",
      description: "Nigdy nie zapomnij o podlewaniu, nawożeniu czy zbiorach"
    },
    {
      icon: Heart,
      title: "Pielęgnacja roślin",
      description: "Monitoruj wzrost i zdrowie swoich roślin"
    },
    {
      icon: Globe,
      title: "Dostępność wszędzie",
      description: "Korzystaj z aplikacji na każdym urządzeniu z przeglądarką"
    }
  ];

  const team = [
    {
      name: "Anna Kowalska",
      role: "Założycielka & CEO",
      description: "Pasjonatka ogrodnictwa z 10-letnim doświadczeniem w branży tech",
      avatar: "👩‍🌾"
    },
    {
      name: "Marek Nowak",
      role: "Lead Developer",
      description: "Ekspert od React i nowoczesnych technologii webowych",
      avatar: "👨‍💻"
    },
    {
      name: "Ewa Wiśniewska",
      role: "UX Designer",
      description: "Projektantka z miłością do natury i intuicyjnych interfejsów",
      avatar: "👩‍🎨"
    }
  ];

  const stats = [
    { label: "Aktywnych użytkowników", value: "10,000+", icon: Users },
    { label: "Zarządzanych roślin", value: "50,000+", icon: Sprout },
    { label: "Ukończonych zadań", value: "100,000+", icon: Award },
    { label: "Krajów", value: "15+", icon: Globe }
  ];

  const technologies = [
    "React", "TypeScript", "Tailwind CSS", "Vite", "PWA"
  ];

  return (
    <div className="min-h-screen p-3 sm:p-6 space-y-6 sm:space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-6 rounded-full bg-gradient-to-br from-emerald/20 to-green/20">
            <Sprout className="h-12 w-12 text-emerald" />
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
          Ogród Glass Zen
        </h1>
        <p className="text-lg text-foreground-secondary max-w-2xl mx-auto">
          Nowoczesna aplikacja do zarządzania ogrodami, która łączy miłość do natury 
          z najnowszymi technologiami webowymi.
        </p>
        <Badge className="bg-emerald/10 text-emerald border-emerald/20 text-sm px-3 py-1">
          Wersja 1.0.0
        </Badge>
      </div>

      {/* Mission */}
      <Card className="glass rounded-xl p-6 sm:p-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 rounded-lg bg-emerald/20">
              <Heart className="h-6 w-6 text-emerald" />
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-foreground">Nasza Misja</h2>
          <p className="text-foreground-secondary max-w-3xl mx-auto leading-relaxed">
            Chcemy uczynić ogrodnictwo dostępnym dla każdego, bez względu na doświadczenie. 
            Nasza aplikacja pomaga organizować pracę w ogrodzie, śledzić wzrost roślin i 
            cieszyć się każdym etapem uprawy. Wierzymy, że kontakt z naturą jest niezbędny 
            dla zdrowia i dobrego samopoczucia.
          </p>
        </div>
      </Card>

      {/* Features */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground text-center">
          Główne funkcje
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <Card key={index} className="glass rounded-xl p-4 sm:p-6">
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-lg bg-emerald/20 flex-shrink-0">
                  <feature.icon className="h-6 w-6 text-emerald" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-foreground-secondary">{feature.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Stats */}
      <Card className="glass rounded-xl p-6">
        <h2 className="text-2xl font-semibold text-foreground text-center mb-6">
          Nasze osiągnięcia
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-2">
                <div className="p-2 rounded-lg bg-emerald/20">
                  <stat.icon className="h-5 w-5 text-emerald" />
                </div>
              </div>
              <div className="text-2xl font-bold text-emerald">{stat.value}</div>
              <div className="text-xs sm:text-sm text-foreground-secondary">{stat.label}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Team */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground text-center">
          Nasz zespół
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {team.map((member, index) => (
            <Card key={index} className="glass rounded-xl p-6 text-center">
              <div className="text-4xl mb-3">{member.avatar}</div>
              <h3 className="font-semibold text-foreground">{member.name}</h3>
              <p className="text-sm text-emerald font-medium mb-2">{member.role}</p>
              <p className="text-xs text-foreground-secondary">{member.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Technology */}
      <Card className="glass rounded-xl p-6">
        <h2 className="text-2xl font-semibold text-foreground text-center mb-4">
          Technologie
        </h2>
        <p className="text-foreground-secondary text-center mb-6">
          Aplikacja została zbudowana przy użyciu nowoczesnych technologii webowych
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {technologies.map((tech, index) => (
            <Badge key={index} variant="outline" className="bg-emerald/10 text-emerald border-emerald/20">
              {tech}
            </Badge>
          ))}
        </div>
      </Card>

      {/* Contact & Social */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="glass rounded-xl p-6">
          <h3 className="font-semibold text-foreground mb-4">Kontakt</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-foreground-secondary" />
              <span className="text-sm text-foreground">kontakt@ogrod-glass-zen.pl</span>
            </div>
            <div className="flex items-center space-x-3">
              <Globe className="h-4 w-4 text-foreground-secondary" />
              <span className="text-sm text-foreground">www.ogrod-glass-zen.pl</span>
            </div>
          </div>
        </Card>
        
        <Card className="glass rounded-xl p-6">
          <h3 className="font-semibold text-foreground mb-4">Śledź nas</h3>
          <div className="flex space-x-3">
            <Button size="sm" variant="outline" className="glass-button">
              <Github className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" className="glass-button">
              <Twitter className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" className="glass-button">
              <Mail className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>

      {/* Open Source */}
      <Card className="glass rounded-xl p-6 border-blue-200 bg-blue-50">
        <div className="flex items-start space-x-4">
          <div className="p-3 rounded-lg bg-blue/20">
            <Star className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-800 mb-2">Open Source</h3>
            <p className="text-blue-700 text-sm mb-3">
              Ogród Glass Zen to projekt open source. Możesz współtworzyć aplikację, 
              zgłaszać błędy i proponować nowe funkcje na naszym GitHubie.
            </p>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Github className="h-4 w-4 mr-2" />
              Zobacz kod źródłowy
            </Button>
          </div>
        </div>
      </Card>

      {/* Thanks */}
      <Card className="glass rounded-xl p-6 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-lg bg-green/20">
            <Leaf className="h-6 w-6 text-green-600" />
          </div>
        </div>
        <h3 className="font-semibold text-foreground mb-2">Dziękujemy!</h3>
        <p className="text-foreground-secondary max-w-2xl mx-auto">
          Dziękujemy wszystkim użytkownikom, kontrybutorm i miłośnikom ogrodnictwa, 
          którzy wspierają rozwój naszej aplikacji. Razem tworzymy lepsze narzędzia 
          dla pasjonatów uprawy roślin.
        </p>
      </Card>

      {/* Footer */}
      <div className="text-center text-sm text-foreground-secondary py-4">
        <p>© 2024 Ogród Glass Zen. Wszystkie prawa zastrzeżone.</p>
        <p className="mt-1">Stworzone z ❤️ dla miłośników ogrodnictwa</p>
      </div>
    </div>
  );
};

export default AboutPage;