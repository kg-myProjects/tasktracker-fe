import React, {useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../../app/hooks';
import {addComment, selectComments} from '../slice/tasksSlice';
import NeonButton from '../../../components/ui/NeonButton';
import {format} from 'date-fns';
import { enUS } from 'date-fns/locale';

interface TaskCommentsProps {
    taskId: string;
}

export const TaskComments: React.FC<TaskCommentsProps> = ({taskId}) => {
    const [text, setText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dispatch = useAppDispatch();
    const comments = useAppSelector(selectComments);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await dispatch(addComment({taskId, text: text.trim()})).unwrap();
            setText('');
        } catch (error) {
            console.error("Failed to add comment:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-8 border-t border-cyan-500/20 pt-6">
            <h4 className="text-sm font-black text-cyan-400 uppercase tracking-[0.2em] flex items-center gap-3">
                <svg xmlns="http://www.w3.org" className="h-4 w-4" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
                Discussion
            </h4>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="mb-6">
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full bg-black/40 border border-cyan-500/30 rounded-xl p-3 text-sm placeholder:text-white text-white outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(6,182,212,0.2)] transition-all min-h-[80px] resize-none"
                />
                <div className="flex justify-end mt-2">
                    <NeonButton
                        size="sm"
                        variant="primary"
                        type="submit"
                        disabled={!text.trim() || isSubmitting}
                    >
<span className={isSubmitting ? "text-slate-400" : "text-cyan-400 font-black"}>
        {isSubmitting ? 'Sending...' : 'Post Comment'}
    </span>
                    </NeonButton>
                </div>
            </form>

            {/* Comments List */}
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {comments.length === 0 ? (
                    <p className="text-xs text-cyan-400 italic uppercase tracking-tighter">No comments yet. Be the first
                        to start the discussion!</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3 group">
                            <div className="flex-shrink-0">
                                {comment.authorAvatarUrl ? (
                                    <img src={comment.authorAvatarUrl} alt={comment.authorName}
                                         className="h-8 w-8 rounded-lg border border-cyan-500/30 shadow-[0_0_5px_rgba(6,182,212,0.2)]"/>
                                ) : (
                                    <div
                                        className="h-8 w-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-xs">
                                        {comment.authorName.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-baseline justify-between gap-2 mb-1">
                                    <span
                                        className="text-xs font-bold text-cyan-400 truncate">{comment.authorName}</span>
                                    <span className="text-[10px] text-cyan-400 whitespace-nowrap">
                                        {format(new Date(comment.createdAt), 'MMM d, HH:mm', { locale: enUS })}
                                    </span>
                                </div>
                                <div
                                    className="bg-white/5 rounded-2xl rounded-tl-none p-3 border border-white/5 group-hover:border-cyan-500/10 transition-all">
                                    <p className="text-sm text-white leading-relaxed">{comment.text}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
