import { useEffect, useState } from "react";
import { fetchCurrentUser } from "../features/auth/services/api";
import type { UserResponseDto } from "../features/auth/types";

export default function Profile() {
  const [userData, setUserData] = useState<UserResponseDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchCurrentUser();
        setUserData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Не удалось загрузить данные пользователя");
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-300 text-lg">Загрузка...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-300 text-lg">Данные пользователя не найдены</p>
      </div>
    );
  }

  const getRoleLabel = (role: string) => {
    return role === "ROLE_ADMIN" ? "Администратор" : "Пользователь";
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      CONFIRMED: "Подтвержден",
      UNCONFIRMED: "Не подтвержден",
      BANNED: "Заблокирован",
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      CONFIRMED: "text-cyan-400",
      UNCONFIRMED: "text-yellow-600",
      BANNED: "text-red-600",
    };
    return colorMap[status] || "text-gray-600";
  };

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Профиль пользователя</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <p className="text-gray-800 text-base">{userData.email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Роль
            </label>
            <p className="text-gray-800 text-base">{getRoleLabel(userData.role)}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Статус
            </label>
            <p className={`text-base font-medium ${getStatusColor(userData.confirmationStatus)}`}>
              {getStatusLabel(userData.confirmationStatus)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
