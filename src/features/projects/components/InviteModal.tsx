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
            <div className="bg-secondary-dark w-96 text-text-muted border border-dark-accent/30 hover:border-dark-accent rounded-xl"
                 onClick={(e) => e.stopPropagation()}>
                <div className="bg-gradient-to-r from-main-dark via-dark-accent to-main-dark rounded-t-xl">
                    <h2 className="h-20 flex items-center justify-center text-xl font-bold text-white text-neon-strong uppercase">
                        Add user to board
                    </h2>
                    <PulsedStripe height="2px"/>
                </div>
                <div className="p-4">
                    <input
                        type="email"
                        placeholder="User email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 mb-3 border border-dark-accent/30 hover:border-dark-accent focus:outline-none focus:border-accent rounded-xl"
                    />
                    <label className="block text-sm text-text-muted mb-1">
                        Board role:
                    </label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value as ProjectRole)}
                        className="w-full px-3 py-2 mb-3 border border-dark-accent/30 hover:border-dark-accent focus:outline-none focus:border-accent rounded-xl"
                    >
                        <option value="MEMBER" className="bg-secondary-dark text-white">Member</option>
                        <option value="ADMIN" className="bg-secondary-dark text-white">Admin</option>
                        <option value="VIEWER" className="bg-secondary-dark text-white">Viewer</option>
                    </select>
                    {error && <p className="text-danger-red text-sm mb-4 font-medium">{error}</p>}
                    <div className="flex justify-end">
                        <MainButton
                            type="button"
                            variant="primary"
                            onClick={handleInviteClick}
                        >
                            Add
                        </MainButton>
                    </div>
                </div>
            </div>
        </div>
    );
}