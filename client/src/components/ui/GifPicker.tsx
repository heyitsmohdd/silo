import { useState } from 'react';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { Grid } from '@giphy/react-components';

// Initialize Giphy Fetch API
const gf = new GiphyFetch(import.meta.env.VITE_GIPHY_API_KEY || '');

interface GifPickerProps {
    onGifSelect: (url: string) => void;
    onClose?: () => void;
}

const GifPicker = ({ onGifSelect, onClose }: GifPickerProps) => {
    const [searchTerm, setSearchTerm] = useState('');

    const fetchGifs = async (offset: number) => {
        try {
            console.log("GIF Fetch Info", {
                keyLength: import.meta.env.VITE_GIPHY_API_KEY?.length,
                searchTerm,
                offset
            });
            if (searchTerm.trim()) {
                return await gf.search(searchTerm, { offset, limit: 10 });
            }
            return await gf.trending({ offset, limit: 10 });
        } catch (error) {
            console.error("Giphy Fetch Error:", error);
            throw error;
        }
    };

    return (
        <div className="flex flex-col bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl w-[300px] sm:w-[350px] h-[400px]">
            <div className="p-3 border-b border-zinc-800 shrink-0">
                <input
                    type="text"
                    placeholder="Search GIFs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700/50 rounded-lg text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-colors"
                />
            </div>
            <div className="flex-1 overflow-y-auto w-full p-2 custom-scrollbar">
                <Grid
                    key={searchTerm} // Force remount when search term changes to reset pagination
                    width={searchTerm ? 282 : 332} // Adjusted width to fit padding (350 - 16 = 334). Note: sm will need responsive width logic
                    columns={2}
                    fetchGifs={fetchGifs}
                    onGifClick={(gif, e) => {
                        e.preventDefault();
                        onGifSelect(gif.images.original.url);
                        if (onClose) onClose();
                    }}
                    noLink
                    hideAttribution
                />
            </div>
        </div>
    );
};

export default GifPicker;
