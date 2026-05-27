import slikaGrudi from './images/anatomija_grudi.jpeg';
import slikaCucanj from './images/cucanj.jpeg';
import slikaRumunsko from './images/romanianDeadlift.jpeg';
import slikaZgibovi from './images/zgib.jpeg';

export const muscleGroups = [
  'Grudi',
  'Leđa',
  'Noge',
  'Ramena',
  'Biceps',
  'Triceps',
  'Podlaktica',
  'Trapezius',
  'Stomak',
  'Gluteus',
  'Noge/Leđa',
  'Leđa/Biceps',
  'Grudi/Triceps'
];

const exercises = [
  {
    _id: '1',
    name: 'Benč pres',
    category: 'Grudi / Triceps',
    description: 'Osnovna vežba za potisak sa klupe, fokusirana na progresivno opterećenje gornjeg dela tela.',
    imageSketch: slikaGrudi
  },
  {
    _id: '2',
    name: 'Čučanj',
    category: 'Noge',
    description: 'Bazična vežba za donji deo tela, ključna za razvoj snage i mobilnosti.',
    imageSketch: slikaCucanj
  },
  {
    _id: '3',
    name: 'Rumunsko mrtvo dizanje',
    category: 'Noge / Leđa',
    description: 'Odlična vežba za zadnju ložu i donja leđa, zahteva pravilnu formu i stabilnost.',
    imageSketch: slikaRumunsko
  },
  {
    _id: '4',
    name: 'Zgibovi',
    category: 'Leđa / Biceps',
    description: 'Vežba sa sopstvenom težinom za izgradnju snage gornjeg dela leđa.',
    imageSketch: slikaZgibovi
  }
];

export default exercises;