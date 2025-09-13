// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Mail, Lock, Sprout } from 'lucide-react';
import { FaGoogle } from 'react-icons/fa';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return;
    }

    setLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (error) {
      console.error('Google login error:', error);
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
          <h1 className="text-2xl font-bold text-foreground">Witaj z powrotem!</h1>
          <p className="text-foreground-secondary">Zaloguj się do swojego ogrodu</p>
        </div>

        {/* Google Login */}
        <Button
          type="button"
          variant="outline"
          className="w-full glass-button"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <FaGoogle className="mr-2 h-4 w-4" />
          Zaloguj się przez Google
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">lub</span>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
          </div>

          <div className="flex justify-end">
            <Link
              to="/reset-password"
              className="text-sm text-emerald hover:text-emerald-light"
            >
              Zapomniałeś hasła?
            </Link>
          </div>

          <Button 
            type="submit" 
            className="w-full emerald-glow" 
            disabled={loading || !formData.email || !formData.password}
          >
            {loading ? 'Logowanie...' : 'Zaloguj się'}
          </Button>
        </form>

        {/* Register Link */}
        <div className="text-center">
          <p className="text-foreground-secondary">
            Nie masz konta?{' '}
            <Link to="/register" className="text-emerald hover:text-emerald-light font-medium">
              Zarejestruj się
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;