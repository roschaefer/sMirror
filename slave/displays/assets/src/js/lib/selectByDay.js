module.exports = (entries) => {
    return entries[new Date().getDay() % entries.length];
};