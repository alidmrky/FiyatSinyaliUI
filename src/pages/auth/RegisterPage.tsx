import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLoading } from '@/contexts/LoadingContext';
import { useNotification } from '@/contexts/NotificationContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, UserPlus, Mail, Lock, User, Calendar } from 'lucide-react';
import type { RegisterDto } from '@/types/auth';

const RegisterPage = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const { showLoading, hideLoading } = useLoading();
    const { success, error } = useNotification();

    const [formData, setFormData] = useState<RegisterDto>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        birthDate: '',
        acceptTerms: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<keyof RegisterDto, string>>>({});

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof RegisterDto, string>> = {};

        if (!formData.firstName?.trim()) {
            newErrors.firstName = 'Ad gerekli';
        }

        if (!formData.lastName?.trim()) {
            newErrors.lastName = 'Soyad gerekli';
        }

        if (!formData.email) {
            newErrors.email = 'Email adresi gerekli';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Geçerli bir email adresi girin';
        }

        if (!formData.password) {
            newErrors.password = 'Şifre gerekli';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Şifre en az 6 karakter olmalı';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Şifre tekrarı gerekli';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Şifreler eşleşmiyor';
        }

        if (!formData.acceptTerms) {
            newErrors.acceptTerms = 'Kullanım koşullarını kabul etmelisiniz';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        showLoading('Hesap oluşturuluyor...');
        try {
            await register(formData);
            success('Hesabınız başarıyla oluşturuldu! 🎉');
            navigate('/');
        } catch (err: any) {
            error(err?.message || 'Kayıt başarısız. Lütfen tekrar deneyin.');
        } finally {
            hideLoading();
        }
    };

    const handleChange = (field: keyof RegisterDto, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
            <div className="w-full max-w-2xl">
                {/* Logo/Brand */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 mb-4 shadow-lg">
                        <UserPlus className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        Fiyat Sinyali
                    </h1>
                    <p className="text-gray-600 mt-2">Yeni hesap oluşturun</p>
                </div>

                <Card className="shadow-xl border-0 backdrop-blur-sm bg-white/80">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center">Kayıt Ol</CardTitle>
                        <CardDescription className="text-center">
                            Ücretsiz hesap oluşturarak başlayın
                        </CardDescription>
                    </CardHeader>

                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            {/* Name Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* First Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="firstName" className="text-sm font-medium">
                                        Ad *
                                    </Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <Input
                                            id="firstName"
                                            type="text"
                                            placeholder="Adınız"
                                            value={formData.firstName}
                                            onChange={(e) => handleChange('firstName', e.target.value)}
                                            className={`pl-10 ${errors.firstName ? 'border-red-500' : ''}`}
                                        />
                                    </div>
                                    {errors.firstName && (
                                        <p className="text-sm text-red-600">{errors.firstName}</p>
                                    )}
                                </div>

                                {/* Last Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="lastName" className="text-sm font-medium">
                                        Soyad *
                                    </Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <Input
                                            id="lastName"
                                            type="text"
                                            placeholder="Soyadınız"
                                            value={formData.lastName}
                                            onChange={(e) => handleChange('lastName', e.target.value)}
                                            className={`pl-10 ${errors.lastName ? 'border-red-500' : ''}`}
                                        />
                                    </div>
                                    {errors.lastName && (
                                        <p className="text-sm text-red-600">{errors.lastName}</p>
                                    )}
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium">
                                    Email Adresi *
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

                            {/* Password Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Password */}
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-sm font-medium">
                                        Şifre *
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

                                {/* Confirm Password */}
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword" className="text-sm font-medium">
                                        Şifre Tekrar *
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <Input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            value={formData.confirmPassword}
                                            onChange={(e) => handleChange('confirmPassword', e.target.value)}
                                            className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && (
                                        <p className="text-sm text-red-600">{errors.confirmPassword}</p>
                                    )}
                                </div>
                            </div>

                            {/* Birth Date (Optional) */}
                            <div className="space-y-2">
                                <Label htmlFor="birthDate" className="text-sm font-medium">
                                    Doğum Tarihi (Opsiyonel)
                                </Label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <Input
                                        id="birthDate"
                                        type="date"
                                        value={formData.birthDate}
                                        onChange={(e) => handleChange('birthDate', e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            {/* Terms */}
                            <div className="space-y-2">
                                <div className="flex items-start space-x-2">
                                    <input
                                        type="checkbox"
                                        id="acceptTerms"
                                        checked={formData.acceptTerms}
                                        onChange={(e) => handleChange('acceptTerms', e.target.checked)}
                                        className={`mt-1 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 ${errors.acceptTerms ? 'border-red-500' : ''}`}
                                    />
                                    <Label htmlFor="acceptTerms" className="text-sm text-gray-600 cursor-pointer">
                                        <Link to="/terms" className="text-purple-600 hover:underline">
                                            Kullanım koşullarını
                                        </Link>{' '}
                                        ve{' '}
                                        <Link to="/privacy" className="text-purple-600 hover:underline">
                                            gizlilik politikasını
                                        </Link>{' '}
                                        kabul ediyorum *
                                    </Label>
                                </div>
                                {errors.acceptTerms && (
                                    <p className="text-sm text-red-600">{errors.acceptTerms}</p>
                                )}
                            </div>
                        </CardContent>

                        <CardFooter className="flex flex-col space-y-4">
                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-6 shadow-lg hover:shadow-xl transition-all"
                            >
                                <UserPlus className="w-5 h-5 mr-2" />
                                Hesap Oluştur
                            </Button>

                            <div className="text-center text-sm text-gray-600">
                                Zaten hesabınız var mı?{' '}
                                <Link to="/login" className="text-purple-600 hover:underline font-medium">
                                    Giriş yapın
                                </Link>
                            </div>
                        </CardFooter>
                    </form>
                </Card>

                <p className="text-center text-sm text-gray-500 mt-8">
                    © 2026 Fiyat Sinyali. Tüm hakları saklıdır.
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
