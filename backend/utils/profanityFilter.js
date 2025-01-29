const badWords = ["kötü", "berbat", "lanet", "rezalet", "****"]; // Add more inappropriate words

exports.checkProfanity = (text) => {
    if (!text) return false; // Avoid error if comment is empty
    const words = text.toLowerCase().split(" ");
    return words.some(word => badWords.includes(word));
};
