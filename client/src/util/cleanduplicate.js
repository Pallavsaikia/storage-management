export function cleanSetList(arr) {
    return arr.filter((arr, index, self) =>
        index === self.findIndex((t) => (t._id === arr._id)))
}