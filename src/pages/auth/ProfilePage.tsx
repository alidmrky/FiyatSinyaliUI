import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLoading } from '@/contexts/LoadingContext';
import { useNotification } from '@/contexts/NotificationContext';
import { authService } from '@/services/api/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Calendar, Shield, Edit2, Save, X } from 'lucide-react';
import type { UpdateUserProfileDto, ChangePasswordDto } from '@/types/auth';

const ProfilePage = () => {
    const { user, refreshUser, updateUserProfile } = useAuth();
    const { showLoading, hideLoading } = useLoading();
    const { success, error } = useNotification();

    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const [profileData, setProfileData] = useState<UpdateUserProfileDto>({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        birthDate: user?.birthDate || '',
        profilePictureUrl: user?.profilePictureUrl || '',
    });

    const [passwordData, setPasswordData] = useState<ChangePasswordDto>({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [passwordErrors, setPasswordErrors] = useState<Partial<ChangePasswordDto>>({});

    useEffect(() => {
        if (user) {
            setProfileData({
                firstName: user.firstName,
                lastName: user.lastName,
                birthDate: user.birthDate || '',
                profilePictureUrl: user.profilePictureUrl || '',
            });
        }
    }, [user]);

    const handleProfileUpdate = async () => {
        showLoading('Profil güncelleniyor...');
        try {
            await authService.updateProfile(profileData);
            updateUserProfile(profileData as any);
            await refreshUser();
            success('Profil başarıyla güncellendi! ✅');
            setIsEditingProfile(false);
        } catch (err: any) {
            error(err?.message || 'Profil güncellenemedi');
        } finally {
            hideLoading();
        }
    };

    const validatePassword = (): boolean => {
        const errors: Partial<ChangePasswordDto> = {};

        if (!passwordData.currentPassword) {
            errors.currentPassword = 'Mevcut şifre gerekli';
        }

        if (!passwordData.newPassword) {
            errors.newPassword = 'Yeni şifre gerekli';
        } else if (passwordData.newPassword.length < 6) {
            errors.newPassword = 'Şifre en az 6 karakter olmalı';
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            errors.confirmPassword = 'Şifreler eşleşmiyor';
        }

        setPasswordErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handlePasswordChange = async () => {
        if (!validatePassword()) {
            return;
        }

        showLoading('Şifre değiştiriliyor...');
        try {
            await authService.changePassword(passwordData);
            success('Şifre başarıyla değiştirildi! ✅');
            setIsChangingPassword(false);
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
            setPasswordErrors({});
        } catch (err: any) {
            error(err?.message || 'Şifre değiştirilemedi');
        } finally {
            hideLoading();
        }
    };

    if (!user) {
        return null;
    }

    return (
        <div className="container max-w-4xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{user.fullName}</h1>
                    <p className="text-gray-600">{user.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                        {user.roles.map(role => (
                            <span
                                key={role}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                                <Shield className="w-3 h-3 mr-1" />
                                {role}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Profile Information Card */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Profil Bilgileri</CardTitle>
                            <CardDescription>Kişisel bilgilerinizi görüntüleyin ve düzenleyin</CardDescription>
                        </div>
                        {!isEditingProfile ? (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsEditingProfile(true)}
                            >
                                <Edit2 className="w-4 h-4 mr-2" />
                                Düzenle
                            </Button>
                        ) : (
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setIsEditingProfile(false);
                                        setProfileData({
                                            firstName: user.firstName,
                                            lastName: user.lastName,
                                            birthDate: user.birthDate || '',
                                            profilePictureUrl: user.profilePictureUrl || '',
                                        });
                                    }}
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    İptal
                                </Button>
                                <Button size="sm" onClick={handleProfileUpdate}>
                                    <Save className="w-4 h-4 mr-2" />
                                    Kaydet
                                </Button>
                            </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* First Name */}
                        <div className="space-y-2">
                            <Label htmlFor="firstName">Ad</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    id="firstName"
                                    value={profileData.firstName}
                                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                                    disabled={!isEditingProfile}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {/* Last Name */}
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Soyad</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    id="lastName"
                                    value={profileData.lastName}
                                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                                    disabled={!isEditingProfile}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Email (Read-only) */}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                id="email"
                                value={user.email}
                                disabled
                                className="pl-10 bg-gray-50"
                            />
                        </div>
                        <p className="text-sm text-gray-500">Email adresi değiştirilemez</p>
                    </div>

                    {/* Birth Date */}
                    <div className="space-y-2">
                        <Label htmlFor="birthDate">Doğum Tarihi</Label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                id="birthDate"
                                type="date"
                                value={profileData.birthDate}
                                onChange={(e) => setProfileData({ ...profileData, birthDate: e.target.value })}
                                disabled={!isEditingProfile}
                                className="pl-10"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Change Password Card */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Şifre Değiştir</CardTitle>
                            <CardDescription>Hesap güvenliğiniz için şifrenizi güncelleyin</CardDescription>
                        </div>
                        {!isChangingPassword && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsChangingPassword(true)}
                            >
                                <Edit2 className="w-4 h-4 mr-2" />
                                Şifre Değiştir
                            </Button>
                        )}
                    </div>
                </CardHeader>
                {isChangingPassword && (
                    <CardContent className="space-y-4">
                        {/* Current Password */}
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword">Mevcut Şifre</Label>
                            <Input
                                id="currentPassword"
                                type="password"
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                className={passwordErrors.currentPassword ? 'border-red-500' : ''}
                            />
                            {passwordErrors.currentPassword && (
                                <p className="text-sm text-red-600">{passwordErrors.currentPassword}</p>
                            )}
                        </div>

                        {/* New Password */}
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">Yeni Şifre</Label>
                            <Input
                                id="newPassword"
                                type="password"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                className={passwordErrors.newPassword ? 'border-red-500' : ''}
                            />
                            {passwordErrors.newPassword && (
                                <p className="text-sm text-red-600">{passwordErrors.newPassword}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Yeni Şifre (Tekrar)</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                className={passwordErrors.confirmPassword ? 'border-red-500' : ''}
                            />
                            {passwordErrors.confirmPassword && (
                                <p className="text-sm text-red-600">{passwordErrors.confirmPassword}</p>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setIsChangingPassword(false);
                                    setPasswordData({
                                        currentPassword: '',
                                        newPassword: '',
                                        confirmPassword: '',
                                    });
                                    setPasswordErrors({});
                                }}
                            >
                                <X className="w-4 h-4 mr-2" />
                                İptal
                            </Button>
                            <Button onClick={handlePasswordChange}>
                                <Save className="w-4 h-4 mr-2" />
                                Şifreyi Kaydet
                            </Button>
                        </div>
                    </CardContent>
                )}
            </Card>

            {/* Account Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Hesap Bilgileri</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Hesap Durumu:</span>
                        <span className="font-medium text-green-600">Aktif</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Email Onayı:</span>
                        <span className={`font-medium ${user.isEmailConfirmed ? 'text-green-600' : 'text-yellow-600'}`}>
                            {user.isEmailConfirmed ? 'Onaylandı ✓' : 'Onay Bekliyor'}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Kayıt Tarihi:</span>
                        <span className="font-medium">{new Date(user.createdAt).toLocaleDateString('tr-TR')}</span>
                    </div>
                    {user.lastLoginAt && (
                        <div className="flex justify-between">
                            <span className="text-gray-600">Son Giriş:</span>
                            <span className="font-medium">{new Date(user.lastLoginAt).toLocaleString('tr-TR')}</span>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ProfilePage;
