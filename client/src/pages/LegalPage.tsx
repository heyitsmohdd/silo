import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldAlert, Scale, FileText, AlertTriangle } from 'lucide-react';

const LegalPage = () => {
    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden">
            <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-black/60 backdrop-blur-[2px]" />
            </div>

            <nav className="fixed top-0 left-0 w-full z-50 p-6 flex justify-between items-center bg-black/50 backdrop-blur-md border-b border-white/10">
                <Link
                    to="/"
                    className="flex items-center gap-2 text-white/50 hover:text-white transition-colors group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">Back to Home</span>
                </Link>
                <div className="text-sm font-['Press_Start_2P'] tracking-tighter text-zinc-400">
                    Silo
                </div>
            </nav>

            <div className="relative z-10 max-w-4xl mx-auto px-6 py-24 md:py-32">
                <div className="mb-16 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
                        Safety & <span className="text-emerald-400">Open Source Terms</span>
                    </h1>
                    <p className="text-xl text-zinc-400 max-w-2xl leading-relaxed">
                        Please read these terms carefully. Silo is a student-led educational project, not a commercial entity.
                    </p>
                </div>

                <div className="space-y-12">
                    <Section
                        icon={<AlertTriangle className="w-6 h-6 text-yellow-400" />}
                        title="1. As-Is Clause & Warranty Disclaimer"
                    >
                        <p className="text-zinc-300 leading-relaxed mb-4">
                            Silo is provided "as is" and "as available" without any warranties of any kind, either express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, or non-infringement.
                        </p>
                        <p className="text-zinc-300 leading-relaxed">
                            We do not warrant that the platform will be uninterrupted or error-free, that defects will be corrected, or that the platform or the server that makes it available are free of viruses or other harmful components. Use Silo at your own risk.
                        </p>
                    </Section>

                    <Section
                        icon={<ShieldAlert className="w-6 h-6 text-rose-400" />}
                        title="2. Student Project Disclaimer"
                    >
                        <p className="text-zinc-300 leading-relaxed">
                            Silo is a non-profit, student-led open-source project created strictly for educational purposes. We are not a registered corporation or a commercial enterprise. The platform is not monetized. By using this platform, you acknowledge that its maintainers are students volunteering their time.
                        </p>
                    </Section>

                    <Section
                        icon={<Scale className="w-6 h-6 text-blue-400" />}
                        title="3. Content Moderation & Safe Harbor"
                    >
                        <p className="text-zinc-300 leading-relaxed mb-4">
                            As an interactive computer service provider, Silo is protected under Section 230 of the Communications Decency Act (or local equivalents globally). We are not publishers or speakers of any information provided by another information content provider.
                        </p>
                        <p className="text-zinc-300 leading-relaxed mb-4">
                            However, we enforce a strict <strong className="text-emerald-400">zero-tolerance policy</strong> for:
                        </p>
                        <ul className="list-disc list-inside text-zinc-300 space-y-2 mb-4 ml-4">
                            <li>Hate speech, harassment, or severe bullying</li>
                            <li>Threats of violence or self-harm</li>
                            <li>Doxxing or sharing private, personally identifiable information</li>
                            <li>Any illegal content or activities</li>
                        </ul>
                        <p className="text-zinc-300 leading-relaxed">
                            We reserve the right to remove any content or suspend any user, at any time, for any reason, without prior notice.
                        </p>
                    </Section>

                    <Section
                        icon={<ShieldAlert className="w-6 h-6 text-violet-400" />}
                        title="4. Law Enforcement Cooperation"
                    >
                        <p className="text-zinc-300 leading-relaxed">
                            While Silo champions anonymity and free speech, we fully cooperate with valid legal requests and law enforcement agencies when compelled by a court order, subpoena, or search warrant, especially concerning matters of imminent physical harm, illegal activities, or explicit threats. Anonymity is not a shield for illegality.
                        </p>
                    </Section>

                    <Section
                        icon={<FileText className="w-6 h-6 text-emerald-400" />}
                        title="5. MIT License"
                    >
                        <div className="bg-zinc-900/50 p-6 rounded-xl border border-white/5 font-mono text-xs text-zinc-400 leading-relaxed overflow-x-auto">
                            <p>Copyright (c) {new Date().getFullYear()} Silo Developers</p>
                            <br />
                            <p>Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:</p>
                            <br />
                            <p>The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.</p>
                            <br />
                            <p>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</p>
                        </div>
                    </Section>
                </div>

                <div className="mt-24 pt-8 border-t border-white/10 text-center">
                    <p className="text-zinc-500 text-sm">
                        For specific inquiries regarding moderation or legal matters, please contact us at <a href="mailto:siloedu00@gmail.com" className="text-emerald-400 hover:underline">siloedu00@gmail.com</a>.
                    </p>
                </div>
            </div>
        </div>
    );
};

const Section = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
    <div className="bg-zinc-900/20 border border-white/5 p-8 rounded-2xl hover:bg-zinc-900/40 transition-colors duration-300">
        <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-white/5 rounded-xl">
                {icon}
            </div>
            <h2 className="text-2xl font-bold text-zinc-100">{title}</h2>
        </div>
        {children}
    </div>
);

export default LegalPage;
