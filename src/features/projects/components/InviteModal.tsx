import {useState} from "react";
import type {InviteModalProps, ProjectRole} from "../types";
import PulsedStripe from "../../../components/ui/effects/PulsedStripe.tsx";
import MainButton from "../../../components/ui/buttons/MainButton.tsx";

export function InviteModal({isOpen, onClose, onInvite, error}: InviteModalProps) {
    const [email, setEmail] = useState("");
    const [role, setRole] = useState<ProjectRole>("MEMBER");

    if (!isOpen) return null;

    const handleInviteClick = () => {
        if (email.trim()) {
            onInvite(email, role);

            setEmail("");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
             onClick={onClose}>
            <div className="bg-slate-900 w-96 text-white border border-cyan-500/20 hover:border-cyan-500/40 rounded-xl"
                 onClick={(e) => e.stopPropagation()}>
                <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 rounded-xl">
                    <h2 className="h-20 flex items-center justify-center text-xl font-bold text-white text-neon-strong uppercase">
                        Add user to board
                    </h2>
                    <PulsedStripe height="2px"></PulsedStripe>
                </div>

                <div className="p-4">
                    <input
                        type="email"
                        placeholder="User email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 mb-3 border border-cyan-500/20 hover:border-cyan-500/40 focus:outline-none focus:border-cyan-500/40 rounded-xl"
                    />
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value as ProjectRole)}
                        className="w-full px-3 py-2 mb-3 border border-cyan-500/20 hover:border-cyan-500/40 focus:outline-none focus:border-cyan-500/40 rounded-xl"
                    >
                        <option value="MEMBER" className="bg-slate-900 text-white">Member</option>
                        <option value="ADMIN" className="bg-slate-900 text-white">Admin</option>
                        <option value="VIEWER" className="bg-slate-900 text-white">Viewer</option>
                    </select>
                    {error && <p className="text-red-500 text-sm mb-4 font-medium">{error}</p>}
                    <div className="flex justify-end">
                        <MainButton
                            type="button"
                            variant="primary"
                            onClick={handleInviteClick}
                        >
                            Invite
                        </MainButton>
                    </div>
                </div>
            </div>
        </div>
    );
}
