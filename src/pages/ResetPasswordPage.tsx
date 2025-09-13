// src/pages/ResetPasswordPage.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, ArrowLeft, Sprout } from 'lucide-react';

const ResetPasswordPage = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (error) {
      console.error('Reset password error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass rounded-2xl p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-emerald/20">
              <Sprout className="h-8 w-8 text-emerald" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {sent ? 'Sprawdź swoją skrzynkę!' : 'Resetuj hasło'}
          </h1>
          <p className="text-foreground-secondary">
            {sent 
              ? 'Wysłaliśmy Ci link do resetowania hasła' 
              : 'Podaj swój adres email, aby zresetować hasło'
            }
          </p>
        </div>

        {sent ? (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <p className="text-foreground-secondary text-sm">
                Jeśli nie widzisz emaila, sprawdź folder spam.
              </p>
            </div>
            <div className="flex space-x-2">
              <Button 
                onClick={() => setSent(false)}
                variant="outline"
                className="flex-1 glass-button"
              >
                Wyślij ponownie
              </Button>
              <Link to="/login" className="flex-1">
                <Button className="w-full emerald-glow">
                  Powrót do logowania
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Reset Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Adres email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-foreground-secondary" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="twoj@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 glass"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full emerald-glow" 
                disabled={loading || !email}
              >
                {loading ? 'Wysyłanie...' : 'Wyślij link resetujący'}
              </Button>
            </form>

            {/* Back to Login */}
            <div className="flex justify-center">
              <Link 
                to="/login" 
                className="flex items-center text-sm text-foreground-secondary hover:text-foreground"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Powrót do logowania
              </Link>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default ResetPasswordPage;