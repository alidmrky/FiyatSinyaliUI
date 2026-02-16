import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLoading } from '@/contexts/LoadingContext';
import { useNotification } from '@/contexts/NotificationContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, LogIn, Mail, Lock } from 'lucide-react';
import type { LoginDto } from '@/types/auth';

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const { showLoading, hideLoading } = useLoading();
    const { success, error } = useNotification();

    const [formData, setFormData] = useState<LoginDto>({
        email: '',
        password: '',
        rememberMe: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<Partial<LoginDto>>({});

    // Get redirect path from location state or default to home
    const from = (location.state as any)?.from?.pathname || '/';

    const validateForm = (): boolean => {
        const newErrors: Partial<LoginDto> = {};

        if (!formData.email) {
            newErrors.email = 'Email adresi gerekli';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Geçerli bir email adresi girin';
        }

        if (!formData.password) {
            newErrors.password = 'Şifre gerekli';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        showLoading('Giriş yapılıyor...');
        try {
            await login(formData);
            success('Hoş geldiniz! 👋');
            navigate(from, { replace: true });
        } catch (err: any) {
            error(err?.message || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
        } finally {
            hideLoading();
        }
    };

    const handleChange = (field: keyof LoginDto, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
            <div className="w-full max-w-md">
                {/* Logo/Brand */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 mb-4 shadow-lg">
                        <LogIn className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Fiyat Sinyali
                    </h1>
                    <p className="text-gray-600 mt-2">Hesabınıza giriş yapın</p>
                </div>

                <Card className="shadow-xl border-0 backdrop-blur-sm bg-white/80">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center">Giriş Yap</CardTitle>
                        <CardDescription className="text-center">
                            Email ve şifreniz ile giriş yapabilirsiniz
                        </CardDescription>
                    </CardHeader>

                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium">
                                    Email Adresi
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="ornek@email.com"
                                        value={formData.email}
                                        onChange={(e) => handleChange('email', e.target.value)}
                                        className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-sm text-red-600">{errors.email}</p>
                                )}
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium">
                                    Şifre
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => handleChange('password', e.target.value)}
                                        className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-sm text-red-600">{errors.password}</p>
                                )}
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="rememberMe"
                                        checked={formData.rememberMe}
                                        onChange={(e) => handleChange('rememberMe', e.target.checked)}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <Label htmlFor="rememberMe" className="text-sm text-gray-600 cursor-pointer">
                                        Beni hatırla
                                    </Label>
                                </div>
                                <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                                    Şifremi unuttum
                                </Link>
                            </div>
                        </CardContent>

                        <CardFooter className="flex flex-col space-y-4">
                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-6 shadow-lg hover:shadow-xl transition-all"
                            >
                                <LogIn className="w-5 h-5 mr-2" />
                                Giriş Yap
                            </Button>

                            <div className="text-center text-sm text-gray-600">
                                Hesabınız yok mu?{' '}
                                <Link to="/register" className="text-blue-600 hover:underline font-medium">
                                    Kayıt olun
                                </Link>
                            </div>
                        </CardFooter>
                    </form>
                </Card>

                {/* Footer */}
                <p className="text-center text-sm text-gray-500 mt-8">
                    © 2026 Fiyat Sinyali. Tüm hakları saklıdır.
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
