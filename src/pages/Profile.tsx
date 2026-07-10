import {usePageTitle} from "../app/customHooks/usePageTitle.ts";
import {useAppDispatch, useAppSelector} from "../app/hooks.ts";
import React, {type Dispatch, type SetStateAction, useEffect, useState} from "react";
import {
    AVATAR_UPDATE_ERROR,
    getUserDetails,
    selectUserData,
    setUserDetails,
    updateUserAvatar,
    updateUserDetails
} from "../features/user/slice/userSlice.ts";
import {selectIsAuthenticated, selectIsInitialized, setUser} from "../features/auth/slice/authSlice.ts";
import type {UpdateUserPayloadDto} from "../features/user/types";
import MainButton from "../components/ui/buttons/MainButton.tsx";
import {API_URL} from "../config/api.ts";

export default function Profile() {
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUserData);
    const isAuthInitialized = useAppSelector(selectIsInitialized);
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    usePageTitle(user ? `TrackerApp | ${user.email}` : "Loading...");

    useEffect(() => {
        if (!isAuthInitialized) return;
        if (!isAuthenticated) return;

        dispatch(getUserDetails());
    }, [dispatch, isAuthInitialized, isAuthenticated]);

    useEffect(() => {
        if (!user) return;

        setEmail(user.email || "");
        setAvatarUrl(user.avatarUrl || null);
        setFirstName(user.firstName || "");
        setLastName(user.lastName || "");
        setBirthDate(user.birthDate || "");
        setCity(user.city || "");
        setPhone(user.phone || "");
        setAbout(user.about || "");
    }, [user]);

    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isEditingAvatar, setIsEditingAvatar] = useState(false);
    const [isEditingEmail, setIsEditingEmail] = useState(false);

    const [errorMessage, setErrorMessage] = useState<string>("");

    const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [email, setEmail] = useState(user?.email || "");
    const [firstName, setFirstName] = useState(user?.firstName || "");
    const [lastName, setLastName] = useState(user?.lastName || "");
    const [birthDate, setBirthDate] = useState(user?.birthDate || "");
    const [city, setCity] = useState(user?.city || "");
    const [phone, setPhone] = useState(user?.phone || "");
    const [about, setAbout] = useState(user?.about || "");

    const fields: [string, string, Dispatch<SetStateAction<string>>][] = [
        ["First Name", firstName, setFirstName],
        ["Last Name", lastName, setLastName],
        ["Birth Date", birthDate, setBirthDate],
        ["City", city, setCity],
        ["Phone", phone, setPhone],
    ];

    const MAX_AVATAR_SIZE = 5 * 1024 * 1024;
    const ALLOWED_AVATAR_TYPES = ["image/jpeg", "image/png"];

    const handleAvatarUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            if (!ALLOWED_AVATAR_TYPES.includes(file.type) || file.size > MAX_AVATAR_SIZE) {
                setErrorMessage("Only JPEG or PNG files smaller than 5MB are allowed!");
                return;
            }

            setSelectedFile(file);
            setIsEditingAvatar(true);
            const previewUrl = URL.createObjectURL(file);
            setAvatarPreview(previewUrl);
        }
    };

    const handleSaveAvatarUpdate = async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const updatedUser = await dispatch(updateUserAvatar(formData)).unwrap();
            // setAvatarUrl(`${updatedUser.avatarUrl}?t=${Date.now()}`);
            setAvatarUrl(updatedUser.avatarUrl);

            dispatch(setUser({...updatedUser}));

            if (avatarPreview) URL.revokeObjectURL(avatarPreview);
            setAvatarPreview(null);
            setSelectedFile(null);
            setIsEditingAvatar(false);

            const input = document.getElementById("avatarInput") as HTMLInputElement | null;
            if (input) input.value = "";

        } catch (error: unknown) {
            setErrorMessage(typeof error === "string" ? error : AVATAR_UPDATE_ERROR);
        }
    };

    const handleCancelAvatarUpdate = () => {
        setAvatarPreview(null);
        setSelectedFile(null);
        setAvatarUrl(user?.avatarUrl || null);
        setIsEditingAvatar(false);

        const input = document.getElementById("avatarInput") as HTMLInputElement | null;
        if (input) input.value = "";
    };

    const handleSaveProfileChanges = async () => {
        const payload: UpdateUserPayloadDto = {
            firstName,
            lastName,
            birthDate,
            city,
            phone,
            about,
        };
        try {
            const updatedUser = await dispatch(updateUserDetails(payload)).unwrap();

            dispatch(setUserDetails(updatedUser));
            setIsEditingProfile(false);

            console.log("Saved profile:", payload);
        } catch (err) {
            console.error("Failed to update profile", err);
            alert("Failed to update profile");
        }
    };

    const handleCancelProfileChanges = () => {
        setIsEditingProfile(false);
        setAvatarUrl(user?.avatarUrl || null);
        setFirstName(user?.firstName || "");
        setLastName(user?.lastName || "");
        setBirthDate(user?.birthDate || "");
        setCity(user?.city || "");
        setPhone(user?.phone || "");
        setAbout(user?.about || "");
    };

    if (!user) {
        return (
            <section className="p-8 flex items-center justify-center text-white">
                Loading user...
            </section>
        );
    }

    return (
        <section className="p-4 md:p-8 border rounded-2xl border-cyan-900/50 bg-transparent">

            <h1 className="mb-6 text-cyan-400 text-xl md:text-3xl font-black tracking-[0.2em] uppercase">
                User Profile
            </h1>

            {/* E-mail / Login */}
            <div className="flex mb-8 gap-2 md:gap-10 items-baseline">
                <div className="text-xs md:text-base font-bold text-cyan-400 whitespace-nowrap">
                    E-mail / Login:
                </div>
                <div className="flex-1 flex flex-col gap-2 items-end">
                    {isEditingEmail ? (
                        <>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-1 py-[5px] md:py-1 text-white text-base rounded border border-cyan-300 bg-slate-800"
                            />
                            <div className="flex gap-2">
                                <MainButton size="compact" onClick={() => {alert("email_saved!");setIsEditingEmail(false);}}>
                                    Save
                                </MainButton>
                                <MainButton size="compact" variant="danger" onClick={() => {setIsEditingEmail(false);setEmail(user.email || "");}}>
                                    Cancel
                                </MainButton>
                            </div>
                        </>
                    ) : (
                        <>
                            <div
                                className="w-full px-1 py-[5px] md:py-1 text-white text-base rounded border border-cyan-300 bg-transparent">
                                {email}
                            </div>
                            <MainButton size="compact" onClick={() => setIsEditingEmail(true)}>
                                Edit E-mail
                            </MainButton>
                        </>
                    )}
                </div>
            </div>

            <hr className="border-cyan-900/50 mb-6"/>

            {/* Main info block */}
            <div className="flex gap-2 md:gap-20">
                {/* Avatar block*/}
                <div className="flex min-w-[130px] md:w-[200px] flex-col items-center">
                    <div className="flex w-28 h-28 md:w-40 md:h-40 items-center justify-center rounded-full overflow-hidden border-2 border-cyan-500 bg-cyan-300 text-white text-4xl">
                        {avatarPreview || avatarUrl ? (
                            <img
                                src={
                                    avatarPreview ||
                                    `${API_URL}${avatarUrl}${user.avatarUpdatedAt ? `?t=${user.avatarUpdatedAt}` : ""}`
                                }
                                alt="user_avatar"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            email?.[0]?.toUpperCase() || "?"
                        )}
                    </div>
                    {/* Hidden input for file selection */}
                    <input
                        id="avatarInput"
                        type="file"
                        accept="image/png, image/jpeg"
                        className="hidden"
                        onChange={handleAvatarUpdate}
                    />
                    {isEditingAvatar ? (
                        <div className="flex mt-2 gap-2">
                            <MainButton size="compact" onClick={handleSaveAvatarUpdate}>
                                Save
                            </MainButton>
                            <MainButton size="compact" variant="danger" onClick={handleCancelAvatarUpdate}>
                                Cancel
                            </MainButton>
                        </div>
                    ) : (
                        <div className="mt-2">
                            <MainButton size="compact" onClick={() => {setErrorMessage("");document.getElementById("avatarInput")?.click()}}>
                                Change Avatar
                            </MainButton>
                        </div>
                    )}
                    {/* Avatar error message */}
                    {errorMessage && (
                        <div
                            className="mt-5 max-w-[130px] md:max-w-[200px] text-red-500 text-xs break-words text-center overflow-hidden">
                            {errorMessage}
                        </div>
                    )}
                </div>

                {/* User details */}
                <div className="flex-1 flex flex-col gap-2">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Details block */}
                        <div className="flex-1 space-y-1 md:space-y-4">
                            {fields.map(([label, value, setter]) => (
                                <div key={label as string} className="flex items-center gap-2">
                                    <label className="min-w-[80px] md:min-w-[115px] text-xs md:text-base font-bold text-cyan-400 whitespace-nowrap">{label}:</label>
                                    {isEditingProfile ? (
                                        <input
                                            type="text"
                                            value={value}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                setter(e.target.value)
                                            }
                                            className="w-full px-1 py-[1px] md:py-1 text-white rounded whitespace-nowrap border border-cyan-300 bg-slate-800"
                                        />
                                    ) : (
                                        <div
                                            className="w-full px-1 py-[1px] md:py-1 text-white text-base whitespace-nowrap bg-transparent rounded border border-cyan-300">
                                            {value || "Not set"}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        {/* About block */}
                        <div className="flex-1 flex flex-col">
                            <label className="text-xs md:text-base font-bold text-cyan-400 mb-2">About:</label>
                            {isEditingProfile ? (
                                <textarea
                                    value={about}
                                    onChange={(e) => setAbout(e.target.value)}
                                    className="flex-1 p-1 min-h-[120px] text-white border rounded border-cyan-300 bg-slate-800 resize-none"
                                />
                            ) : (
                                <div
                                    className="flex-1 p-1 min-h-[120px] text-white border rounded border-cyan-300 bg-transparent">
                                    {about || "Not set"}
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Bottom edit buttons */}
                    <div className="flex justify-end gap-2">
                        {isEditingProfile ? (
                            <>
                                <MainButton size="compact" onClick={handleSaveProfileChanges}>
                                    Save
                                </MainButton>
                                <MainButton variant="danger" size="compact" onClick={handleCancelProfileChanges}>
                                    Cancel
                                </MainButton>
                            </>
                        ) : (
                            <MainButton size="compact" onClick={() => setIsEditingProfile(true)}>
                                Edit Profile
                            </MainButton>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}