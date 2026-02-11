
/**
 * Generate a deterministic anonymous identity from a user ID
 * Returns a GitHub/Reddit-style codename and robot avatar
 */
export const getIdentity = (id: string, username?: string) => {
    // Determine name to display
    const name = username || "Loading...";

    // Generate robot avatar using DiceBear (still deterministic based on ID)
    const avatar = `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${id}`;

    return { name, avatar };
};
