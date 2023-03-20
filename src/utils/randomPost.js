/**
 *
 * @param {Array} posts
 * @param {number} numberPost
 */
const randomPosts = (posts, numberPost) => {
    const n = posts.length;
    if (n >= numberPost) {
        const arrayIndex = [];

        while (arrayIndex.length < numberPost) {
            const randomNumber = Math.floor(Math.random() * n);
            if (!arrayIndex.includes(randomNumber)) {
                arrayIndex.push(randomNumber);
            }
        }

        const newPosts = [];

        for (let i = 0; i < numberPost; i++) {
            newPosts[i] = posts[arrayIndex[i]];
        }

        return newPosts;
    } else {
        throw new Error(" posts.length >= numberPost");
    }
};

module.exports = randomPosts;
