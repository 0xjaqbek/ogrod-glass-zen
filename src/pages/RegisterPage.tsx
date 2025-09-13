// src/pages/RegisterPage.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Mail, Lock, User, Sprout } from 'lucide-react';
import { FaGoogle } from 'react-icons/fa';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, loginWithGoogle } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      return;
    }

    if (formData.password.length < 6) {
      return;
    }

    setLoading(true);
    try {
      await register(formData.email, formData.password, formData.name);
      navigate('/');
    } catch (error) {
      console.error('Register error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (error) {
      console.error('Google register error:', error);
    } finally {
      setLoading(false);
    }
  };

  const isPasswordValid = formData.password.length >= 6;
  const doPasswordsMatch = formData.password === formData.confirmPassword;
  const isFormValid = formData.name && formData.email && formData.password && formData.confirmPassword && isPasswordValid && doPasswordsMatch;

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
          <h1 className="text-2xl font-bold text-foreground">Dołącz do nas!</h1>
          <p className="text-foreground-secondary">Stwórz swoje konto ogrodnicze</p>
        </div>

        {/* Google Register */}
        <Button
          type="button"
          variant="outline"
          className="w-full glass-button"
          onClick={handleGoogleRegister}
          disabled={loading}
        >
          <FaGoogle className="mr-2 h-4 w-4" />
          Zarejestruj się przez Google
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">lub</span>
          </div>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Imię</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-foreground-secondary" />
              <Input
                id="name"
                type="text"
                placeholder="Twoje imię"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="pl-10 glass"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-foreground-secondary" />
              <Input
                id="email"
                type="email"
                placeholder="twoj@email.com"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="pl-10 glass"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Hasło</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-foreground-secondary" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="pl-10 pr-10 glass"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-foreground-secondary hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {formData.password && !isPasswordValid && (
              <p className="text-xs text-red-400">Hasło musi mieć co najmniej 6 znaków</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Powtórz hasło</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-foreground-secondary" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className="pl-10 pr-10 glass"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-foreground-secondary hover:text-foreground"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {formData.confirmPassword && !doPasswordsMatch && (
              <p className="text-xs text-red-400">Hasła nie są identyczne</p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full emerald-glow" 
            disabled={loading || !isFormValid}
          >
            {loading ? 'Tworzenie konta...' : 'Utwórz konto'}
          </Button>
        </form>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-foreground-secondary">
            Masz już konto?{' '}
            <Link to="/login" className="text-emerald hover:text-emerald-light font-medium">
              Zaloguj się
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;