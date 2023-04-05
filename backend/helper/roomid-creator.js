const roomtypedict = require('../static_vars/roomtype_dict')

function findCount(max, list, roomType) {
    if (roomType === roomtypedict.dining_round.name) {
        for (let i = 2; i <= max; i = i + 2) {
            if (!(list.includes(i))) {
                return i
            }
        }
        return max + 2
    } else if (roomType === roomtypedict.dining.name) {
        for (let i = 1; i <= max; i = i + 2) {
            if (!(list.includes(i))) {
                return i
            }
        }
        return max + 2
    } else {
        for (let i = 1; i <= max; i++) {
            if (!(list.includes(i))) {
                return i
            }
        }
        return max + 1
    }
}

function getAppopriateCount(roomlist, roomType) {
    const numlist = []
    if (roomlist.length != 0) {
        for (let i = 0; i < roomlist.length; i++) {
            const tmp = roomlist[i].roomID.split("-")[1]
            numlist.push(parseInt(tmp.match(/\d+/)[0]))
        }
        const tmplist = numlist.sort()
        const max = tmplist[tmplist.length - 1]
        return findCount(max, tmplist, roomType)
    }else{
        if (roomType === roomtypedict.dining_round.name) {
            return 2
        } else if (roomType === roomtypedict.dining.name) {
            return 1
        } else {
            return 1
        }
    }

}

module.exports = function (setid, roomlist, roomType) {
    const count = getAppopriateCount(roomlist, roomType)
    return setid + "-" + roomtypedict[roomType].abbr + count
}   