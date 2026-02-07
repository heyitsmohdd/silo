/**
 * Generate a deterministic anonymous identity from a user ID
 * Returns a GitHub/Reddit-style codename and robot avatar
 */
export const getIdentity = (id: string) => {
    const adjs = ["Neon", "Cyber", "Silent", "Iron", "Rogue", "Ghost", "Dark", "Frost", "Storm", "Nova"];
    const nouns = ["Fox", "Badger", "Nexus", "Ghost", "Viper", "Wolf", "Hawk", "Dragon", "Phoenix", "Raven"];

    // Simple deterministic hash
    const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

    // Generate codename
    const name = `${adjs[hash % adjs.length]}-${nouns[(hash >> 1) % nouns.length]}`;

    // Generate robot avatar using DiceBear
    const avatar = `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${id}`;

    return { name, avatar };
};
