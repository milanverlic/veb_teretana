const historyData = [
  {
    _id: 'h1',
    name: 'Večernji Trening',
    date: 'Petak, 15. Maj',
    duration: '1h 24m',
    volume: '8500 kg',
    prs: 7,
    exercises: [
      { name: 'Čučanj (Barbell)', summary: '5 serija', best: '77,5 kg x 5' },
      { name: 'Rumunsko mrtvo dizanje', summary: '4 serije', best: '72,5 kg x 8' },
      { name: 'Zgibovi', summary: '3 serije', best: 'Sopstvena težina x 10' }
    ]
  },
  {
    _id: 'h2',
    name: 'Jutarnji Trening',
    date: 'Ponedeljak, 11. Maj',
    duration: '1h 11m',
    volume: '5148 kg',
    prs: 2,
    exercises: [
      { name: 'Benč pres', summary: '5 serija', best: '60 kg x 8' },
      { name: 'Veslanje u pretklonu', summary: '4 serije', best: '65 kg x 10' }
    ]
  }
];

export default historyData;