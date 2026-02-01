import React, {useEffect, useState} from "react";
import {fetchCurrentUser, updateUserData, uploadAvatar} from "../features/auth/services/api";
import type {UserResponseDto} from "../features/auth/types";
import {generateAvatar} from "../utils/avatar";
import {useNavigate} from "react-router-dom";
import { useAppDispatch } from "../app/hooks";
import { setUser } from "../features/auth/slice/authSlice";

export default function Profile() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [userData, setUserData] = useState<UserResponseDto | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedNickname, setEditedNickname] = useState<string>("");
    const [uploading, setUploading] = useState(false);


    useEffect(() => {
        const loadUserData = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchCurrentUser();
                setUserData(data);
                setEditedNickname(data.nickname || "");
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load user data");
            } finally {
                setLoading(false);
            }
        };

        loadUserData();
    }, []);

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !userData) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            setUploading(true);
            setError(null);

            const updateUser = await uploadAvatar(formData);
            const avatarUrl = updateUser.avatarUrl
                ? `${updateUser.avatarUrl}${updateUser.avatarUrl.includes("?") ? "&" : "?"}t=${Date.now()}`
                : undefined;
            const updatedUser = {
                ...updateUser,
                avatarUrl,
            };
            setUserData(updatedUser);
            dispatch(setUser(updatedUser));
        } catch (err) {
            console.error("Avatar upload error:", err);
            setError("Failed to upload avatar");
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    };

    const handleSave = async () => {
        if (!userData) return;

        try {
            setLoading(true);

            const updated = await updateUserData(editedNickname);

            setUserData(updated);
            dispatch(setUser(updated));
            setIsEditing(false);
        } catch {
            setError("Failed to save changes");
        } finally {
            setLoading(false);
        }
    };


    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-gray-300 text-lg">Loading...</p>
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
                <p className="text-gray-300 text-lg">User data not found</p>
            </div>
        );
    }

    const getRoleLabel = (role: string) => {
        return role === "ROLE_ADMIN" ? "Administrator" : "User";
    };

    const getStatusLabel = (status: string) => {
        const statusMap: Record<string, string> = {
            CONFIRMED: "Confirmed",
            UNCONFIRMED: "Not confirmed",
            BANNED: "Blocked",
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
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
                <button
                    onClick={() => navigate("/")}
                    className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full border border-cyan-400/50 text-cyan-700 hover:bg-cyan-400/10 hover:shadow-[0_0_12px_rgba(6,182,212,0.6)] transition"
                    aria-label="Close"> ✕
                </button>
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">User profile</h1>


                <div className="space-y-4">
                    <div className="flex flex-col items-center mb-6 gap-3">
                        <img
                            src={userData.avatarUrl || generateAvatar(userData.email)}
                            alt="Avatar"
                            className="w-24 h-24 rounded-full border-2 border-cyan-400"
                        />
                        <label
                            className="cursor-pointer bg-cyan-700 text-white px-3 py-1 rounded hover:bg-cyan-600 transition text-sm">
                            {uploading ? "Uploading..." : "Upload photo"}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarUpload}
                                className="hidden"/>
                        </label>
                    </div>

                    <div className="border border-gray-300 rounded-lg p-4">
                        <label className="block text-base font-bold text-gray-600 mb-1">
                            Email
                        </label>
                        <p className="text-cyan-600 font-semibold text-base">{userData.email}</p>
                    </div>
                    <div className="border border-gray-300 rounded-lg p-4">
                        <label className="block text-base font-bold text-gray-600 mb-1">
                            Nickname
                        </label>
                        {isEditing ? (
                            <input
                                type="text"
                                value={editedNickname}
                                onChange={(e) => setEditedNickname(e.target.value)}
                                className="border px-2 py-1 rounded w-full text-black bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400"/>
                        ) : (

                            <p className="text-gray-800 text-base">{userData.nickname || "Not set"}</p>
                        )}
                    </div>

                    <div className="border border-gray-300 rounded-lg p-4">
                        <label className="block text-base font-bold text-gray-600 mb-1">
                            Role
                        </label>
                        <p className="text-gray-800 text-base">{getRoleLabel(userData.role)}</p>
                    </div>

                    <div className="border border-gray-300 rounded-lg p-4">
                        <label className="block text-base font-bold text-gray-600 mb-1">
                            Status
                        </label>
                        <p className={`text-base font-medium ${getStatusColor(userData.confirmationStatus)}`}>
                            {getStatusLabel(userData.confirmationStatus)}
                        </p>
                    </div>
                    {!isEditing && (
                        <div className="mt-6 flex justify-start">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-cyan-700 text-white px-4 py-2 rounded hover:bg-cyan-600 transition">Edit
                            </button>
                        </div>
                    )}
                    {isEditing && (
                        <div className="mt-6 flex justify-between items-center">
                            <button
                                onClick={handleSave}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 transition">Save
                            </button>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition">Cancel
                            </button>


                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

