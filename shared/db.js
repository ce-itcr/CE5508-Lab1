const spaces = [
    { id: 1, name: 'space1', state: 'free'},
    { id: 2, name: 'space2', state: 'free'},
    { id: 3, name: 'space3', state: 'in-use'},
    { id: 4, name: 'space4', state: 'in-use'},
    { id: 5, name: 'space5', state: 'in-use'},
];

const reservations = [
    { id: 1, license: 'BJT001', checkIn: '08:30:00', spaceId: 3 },
    { id: 2, license: 'ASD004', checkIn: '09:30:10', spaceId: 4 },
    { id: 3, license: 'RTY005', checkIn: '10:30:20', spaceId: 5 },
];

reservationsLength = 3;
spacesLength = 5;

module.exports = {spaces, spacesLength, reservations, reservationsLength};