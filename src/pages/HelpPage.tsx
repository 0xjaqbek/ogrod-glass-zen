import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  ChevronDown, 
  ChevronRight, 
  Search, 
  MessageCircle, 
  Mail, 
  Phone, 
  HelpCircle,
  Book,
  Video,
  FileText
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const HelpPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleContactSubmit = () => {
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast({
        title: "Błąd",
        description: "Wypełnij wszystkie wymagane pola",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Wiadomość wysłana! 📧",
      description: "Skontaktujemy się z Tobą w ciągu 24 godzin",
    });

    setContactForm({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  const faqData = [
    {
      id: 'getting-started',
      title: 'Pierwsze kroki',
      questions: [
        {
          q: 'Jak utworzyć pierwszy ogród?',
          a: 'Kliknij przycisk "+" na stronie głównej lub przejdź do sekcji "Ogrody" i wybierz "Utwórz pierwszy ogród". Wypełnij nazwę i opcjonalny opis swojego ogrodu.'
        },
        {
          q: 'Jak dodać grządkę do ogrodu?',
          a: 'W szczegółach ogrodu kliknij "Dodaj grządkę" i wypełnij informacje takie jak nazwa, lokalizacja i rozmiar grządki.'
        },
        {
          q: 'Jak posadzić pierwszą roślinę?',
          a: 'Przejdź do grządki i kliknij "Dodaj roślinę". Wybierz typ rośliny z listy lub wprowadź własną nazwę. Ustaw fazę wzrostu i dodaj dodatkowe informacje.'
        }
      ]
    },
    {
      id: 'tasks',
      title: 'Zarządzanie zadaniami',
      questions: [
        {
          q: 'Jak tworzyć zadania?',
          a: 'Przejdź do sekcji "Zadania" i kliknij przycisk "+". Wypełnij tytuł, opis, wybierz typ zadania, priorytet i termin wykonania.'
        },
        {
          q: 'Jakie są typy zadań?',
          a: 'Dostępne są: Podlewanie, Nawożenie, Zbiory, Przycinanie i Inne. Każdy typ ma swoją ikonę i może być powiązany z konkretną rośliną.'
        },
        {
          q: 'Jak oznaczać zadania jako wykonane?',
          a: 'Kliknij przycisk "Gotowe" przy zadaniu na liście lub w szczegółach zadania. Zadanie zostanie automatycznie oznaczone jako ukończone.'
        }
      ]
    },
    {
      id: 'plants',
      title: 'Pielęgnacja roślin',
      questions: [
        {
          q: 'Jak śledzić postęp wzrostu roślin?',
          a: 'Każda roślina ma pasek postępu i fazę wzrostu. Możesz ręcznie aktualizować te informacje w szczegółach rośliny.'
        },
        {
          q: 'Co oznaczają fazy wzrostu?',
          a: 'Fazy to: Posadzone (nasiona/sadzonki), Wzrost (rozwój liści), Kwitnienie, Owocowanie, Dojrzałe (gotowe do zbioru).'
        },
        {
          q: 'Jak dodać notatki o roślinie?',
          a: 'W szczegółach rośliny znajdziesz pole "Notatki" gdzie możesz zapisać obserwacje, daty podlewania, nawożenia itp.'
        }
      ]
    },
    {
      id: 'notifications',
      title: 'Powiadomienia',
      questions: [
        {
          q: 'Skąd się biorą powiadomienia?',
          a: 'Powiadomienia są generowane automatycznie na podstawie zadań (przypomnienia o terminach) i wydarzeń w ogrodzie (czas zbioru, potrzeba podlania).'
        },
        {
          q: 'Jak zarządzać powiadomieniami?',
          a: 'W sekcji "Powiadomienia" możesz przeglądać wszystkie powiadomienia, oznaczać jako przeczytane lub usuwać niepotrzebne.'
        }
      ]
    },
    {
      id: 'troubleshooting',
      title: 'Rozwiązywanie problemów',
      questions: [
        {
          q: 'Aplikacja działa wolno',
          a: 'Spróbuj odświeżyć stronę (Ctrl+F5). Jeśli problem się powtarza, skontaktuj się z naszym zespołem wsparcia.'
        },
        {
          q: 'Nie widzę swoich danych',
          a: 'Dane są przechowywane lokalnie w przeglądarce. Sprawdź czy nie używasz trybu prywatnego lub czy nie wyczyściłeś danych przeglądarki.'
        },
        {
          q: 'Jak eksportować swoje dane?',
          a: 'Obecnie nie ma funkcji eksportu, ale pracujemy nad jej dodaniem. Dane są bezpiecznie przechowywane w Twojej przeglądarce.'
        }
      ]
    }
  ];

  const filteredFaq = faqData.map(section => ({
    ...section,
    questions: section.questions.filter(
      item => 
        searchQuery === '' ||
        item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.questions.length > 0);

  const quickLinks = [
    { title: 'Przewodnik dla początkujących', icon: Book, description: 'Kompletny przewodnik po aplikacji' },
    { title: 'Tutorial wideo', icon: Video, description: 'Obejrzyj jak korzystać z aplikacji' },
    { title: 'Dokumentacja API', icon: FileText, description: 'Dla zaawansowanych użytkowników' },
  ];

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-full bg-emerald/20">
            <HelpCircle className="h-8 w-8 text-emerald" />
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Centrum Pomocy
        </h1>
        <p className="text-foreground-secondary">
          Znajdź odpowiedzi na swoje pytania lub skontaktuj się z nami
        </p>
      </div>

      {/* Search */}
      <Card className="glass rounded-xl p-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-foreground-secondary" />
          <Input
            placeholder="Szukaj w centrum pomocy..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="glass pl-10"
          />
        </div>
      </Card>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {quickLinks.map((link, index) => (
          <Card key={index} className="glass rounded-xl p-4 glass-hover cursor-pointer">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-emerald/20">
                <link.icon className="h-5 w-5 text-emerald" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">{link.title}</h3>
                <p className="text-xs text-foreground-secondary">{link.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* FAQ */}
      <Card className="glass rounded-xl p-4 sm:p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Najczęściej zadawane pytania
        </h2>
        
        {filteredFaq.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-foreground-secondary">
              {searchQuery ? 'Nie znaleziono wyników dla Twojego zapytania' : 'Brak dostępnych pytań'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFaq.map((section) => (
              <div key={section.id} className="space-y-2">
                <Collapsible
                  open={openSections[section.id]}
                  onOpenChange={() => toggleSection(section.id)}
                >
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="bg-emerald/10 text-emerald border-emerald/20">
                          {section.title}
                        </Badge>
                        <span className="text-sm text-foreground-secondary">
                          ({section.questions.length})
                        </span>
                      </div>
                      {openSections[section.id] ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-3 pt-3">
                    {section.questions.map((item, qIndex) => (
                      <div key={qIndex} className="pl-4 border-l-2 border-emerald/20">
                        <h4 className="font-medium text-foreground mb-1">{item.q}</h4>
                        <p className="text-sm text-foreground-secondary">{item.a}</p>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Contact Form */}
      <Card className="glass rounded-xl p-4 sm:p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Skontaktuj się z nami
        </h2>
        <p className="text-foreground-secondary mb-4">
          Nie znalazłeś odpowiedzi na swoje pytanie? Wyślij nam wiadomość!
        </p>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Imię *
              </label>
              <Input
                value={contactForm.name}
                onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Twoje imię"
                className="glass"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Email *
              </label>
              <Input
                type="email"
                value={contactForm.email}
                onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="twoj@email.com"
                className="glass"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Temat
            </label>
            <Input
              value={contactForm.subject}
              onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="Temat wiadomości"
              className="glass"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Wiadomość *
            </label>
            <Textarea
              value={contactForm.message}
              onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Opisz swój problem lub pytanie..."
              className="glass"
              rows={4}
            />
          </div>
          
          <Button 
            onClick={handleContactSubmit}
            className="emerald-glow w-full sm:w-auto"
            disabled={!contactForm.name || !contactForm.email || !contactForm.message}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Wyślij wiadomość
          </Button>
        </div>
      </Card>

      {/* Contact Info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card className="glass rounded-xl p-4 text-center">
          <div className="flex justify-center mb-2">
            <div className="p-2 rounded-lg bg-blue/20">
              <Mail className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <h3 className="font-medium text-foreground">Email</h3>
          <p className="text-sm text-foreground-secondary">pomoc@ogrod.app</p>
        </Card>
        
        <Card className="glass rounded-xl p-4 text-center">
          <div className="flex justify-center mb-2">
            <div className="p-2 rounded-lg bg-green/20">
              <Phone className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <h3 className="font-medium text-foreground">Telefon</h3>
          <p className="text-sm text-foreground-secondary">+48 123 456 789</p>
        </Card>
        
        <Card className="glass rounded-xl p-4 text-center">
          <div className="flex justify-center mb-2">
            <div className="p-2 rounded-lg bg-purple/20">
              <MessageCircle className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <h3 className="font-medium text-foreground">Czat na żywo</h3>
          <p className="text-sm text-foreground-secondary">Pn-Pt 9:00-17:00</p>
        </Card>
      </div>

      {/* Tips */}
      <Card className="glass rounded-xl p-4 border-blue-200 bg-blue-50">
        <div className="flex items-start space-x-3">
          <div className="text-blue-600">💡</div>
          <div>
            <h3 className="font-medium text-blue-800">Wskazówki</h3>
            <ul className="text-sm text-blue-700 mt-2 space-y-1">
              <li>• Sprawdź centrum pomocy przed wysłaniem zapytania</li>
              <li>• Opisz problem jak najdokładniej</li>
              <li>• Dołącz zrzuty ekranu jeśli to możliwe</li>
              <li>• Odpowiadamy w ciągu 24 godzin w dni robocze</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default HelpPage;