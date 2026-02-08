const DashboardPlaceholder = () => {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center max-w-2xl px-6">
                <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    Welcome to Silo
                </h1>

                <div className="space-y-4 text-zinc-300 text-lg leading-relaxed">
                    <p>
                        Hey! 👋 So glad you're here. We built Silo because we were tired of chaotic WhatsApp groups and scattered Google Docs.
                    </p>

                    <p>
                        This is your batch's private space—think of it as your own little corner of the internet where you can share notes, ask questions, and actually stay organized for once.
                    </p>

                    <p className="text-emerald-400 font-medium">
                        No noise. No distractions. Just your classmates, your semester, your stuff.
                    </p>

                    <div className="pt-6 flex flex-col sm:flex-row gap-3 justify-center items-center text-sm text-zinc-400">
                        <div className="flex items-center gap-2">
                            <span className="text-emerald-400">→</span>
                            <span>Share notes in <strong>Notes</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-emerald-400">→</span>
                            <span>Ask doubts in <strong>Q&A</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-emerald-400">→</span>
                            <span>Chat with your batch in <strong>Chat</strong></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPlaceholder;

