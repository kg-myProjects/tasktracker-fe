import React, { useRef, useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { uploadTaskAttachment } from '../slice/tasksSlice';
import type {Attachment, UpdateTaskDto} from '../types';

interface AttachmentPickerProps {
    taskId: string;
    isUpdating: boolean;
    onClose: () => void;
    onPatchTask: (fields: Partial<UpdateTaskDto>) => void;
    currentAttachments: Attachment[];}

export const AttachmentPicker = ({ taskId, isUpdating, onClose, onPatchTask, currentAttachments }: AttachmentPickerProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dispatch = useAppDispatch();
    const [linkInput, setLinkInput] = useState("");
    const [linkName, setLinkName] = useState("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            dispatch(uploadTaskAttachment({ taskId, file }));
            if (fileInputRef.current) fileInputRef.current.value = "";
            onClose();
        }
    };

    const handleAttachLink = () => {
        const rawUrl = linkInput.trim();
        if (!rawUrl) return;

        // Гарантуємо протокол https
        let secureUrl = rawUrl;
        if (!/^https?:\/\//i.test(rawUrl)) {
            secureUrl = `https://${rawUrl}`;
        }

        const newLink: Attachment = {
            id: "",
            name: linkName.trim() || rawUrl,
            url: secureUrl,
            type: "LINK",
            createdAt: new Date().toISOString()
        };

        onPatchTask({ attachments: [...currentAttachments, newLink] });
        setLinkInput("");
        setLinkName("");
        onClose();
    };

    return (
        <div onClick={e => e.stopPropagation()} className="w-[300px] bg-white border-2 border-cyan-400 rounded-3xl shadow-2xl p-6 z-[100] mt-2 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-in slide-in-from-right-4">
            <div className="flex justify-between items-center mb-4 text-slate-800">
                <span className="text-[11px] font-black uppercase tracking-widest">Attach from...</span>
                {/*<button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>*/}
            </div>

            <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUpdating}
                className="w-full bg-[#f1f2f4] hover:bg-cyan-50 text-slate-600 text-[10px] font-black py-4 rounded-2xl mb-4 border-2 border-dashed border-slate-300 hover:border-cyan-400 transition-all uppercase"
            >
                {isUpdating ? "Uploading..." : "💻 Computer (File)"}
            </button>

            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />

            <div className="space-y-4 text-left border-t border-slate-100 pt-4">
                <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase ml-1">Attach a link</label>
                    <input
                        type="text"
                        className="w-full bg-[#f1f2f4] border-2 border-transparent rounded-xl px-4 py-2.5 text-xs outline-none focus:bg-white focus:border-cyan-400 shadow-inner text-slate-800 font-bold"
                        placeholder="Paste link here..."
                        value={linkInput}
                        onChange={(e) => setLinkInput(e.target.value)}
                    />
                </div>
                <div className="flex justify-end pt-2">
                    <button onClick={handleAttachLink} className="bg-cyan-500 text-white text-[10px] font-black px-6 py-2 rounded-xl shadow-lg uppercase hover:bg-cyan-400 transition-all">
                        Attach Link
                    </button>
                </div>
            </div>
        </div>
    );
};
