const spaces = [
    { id: 1, name: 'space1', state: 'free'},
    { id: 2, name: 'space2', state: 'free'},
    { id: 3, name: 'space3', state: 'in-use'},
    { id: 4, name: 'space4', state: 'in-use'},
    { id: 5, name: 'space5', state: 'in-use'},
    { id: 6, name: 'space6', state: 'free'},
    { id: 7, name: 'space7', state: 'free'},
    { id: 8, name: 'space8', state: 'in-use'},
    { id: 9, name: 'space9', state: 'in-use'},
    { id: 10, name: 'space10', state: 'in-use'},
    { id: 11, name: 'space11', state: 'free'},
    { id: 12, name: 'space12', state: 'free'},
    { id: 13, name: 'space13', state: 'in-use'},
    { id: 14, name: 'space14', state: 'in-use'},
    { id: 15, name: 'space15', state: 'in-use'},
];

const reservations = [
    { id: 1, license: 'BJT001', checkIn: '08:30:00', spaceId: 3 },
    { id: 2, license: 'ASD004', checkIn: '09:30:10', spaceId: 4 },
    { id: 3, license: 'RTY005', checkIn: '10:30:20', spaceId: 5 },
];

reservationsLength = 3;
spacesLength = 5;

module.exports = {spaces, spacesLength, reservations, reservationsLength};