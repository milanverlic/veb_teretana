const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Exercise = require('./models/Exercise');

dotenv.config();

const exercises = [
  // --- GRUDI ---
  {
    name: 'Benč pres dvoručnim tegom',
    category: 'Grudi',
    description: 'Osnovna višezglobna vežba za razvoj snage i mase grudnih mišića. Spuštati šipku kontrolisano do donjeg dela grudi, pa eksplozivno potisnuti nagore.',
    imageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Bench_Press/0.jpg'
  },
  {
    name: 'Kosi potisak bučicama',
    category: 'Grudi',
    description: 'Fokus na gornji deo grudnih mišića (klavikularni deo) i stabilizaciju ramenog pojasa. Klupa treba da bude pod uglom od 30 do 45 stepeni.',
    imageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Dumbbell_Press/0.jpg'
  },
  {
    name: 'Razvlačenje bučicama na ravnoj klupi',
    category: 'Grudi',
    description: 'Izolaciona vežba za maksimalno istezanje i širinu grudnog mišića. Ruke držati blago savijene u laktovima tokom celog pokreta.',
    imageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Flyes/0.jpg'
  },
  {
    name: 'Sklekovi (Push-ups)',
    category: 'Grudi',
    description: 'Fundamentalna vežba sopstvenom težinom za grudi, prednje rame i tricepse. Držati telo ravno kao daska, bez propadanja u kukovima.',
    imageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Pushups/0.jpg'
  },

  // --- LEĐA ---
  {
    name: 'ZgIbovi (Pull-ups)',
    category: 'Leđa',
    description: 'Najbolja vežba sopstvenom težinom za širinu leđa (latisimuse). Hvat treba da bude širi od širine ramena, a grudi vući gore ka šipki.',
    imageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Pullups/0.jpg'
  },
  {
    name: 'Veslanje u pretklonu sa šipkom',
    category: 'Leđa',
    description: 'Gradi debljinu leđa, pogađa srednji i donji deo trapeza. Leđa moraju biti potpuno ravna tokom pretklona, a šipka se vuče ka pupku.',
    imageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Row/0.jpg'
  },
  {
    name: 'Lat mašina ispred glave',
    category: 'Leđa',
    description: 'Odlična alternativa zgibovima sa punom kontrolom težine. Vući polugu kontrolisano do gornjeg dela grudi uz stezanje lopatica.',
    imageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Wide-Grip_Lat_Pulldown/0.jpg'
  },
  {
    name: 'Mrtvo dizanje (Deadlift)',
    category: 'Leđa',
    description: 'Kompletna vežba za snagu celog tela, primarno pogađa erektore leđa, gluteus i zadnju ložu. Podizati teret iz nogu držeći šipku uz telo.',
    imageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Deadlift/0.jpg'
  },

  // --- NOGE ---
  {
    name: 'Čučanj sa šipkom na leđima',
    category: 'Noge',
    description: 'Kraljica svih vežbi. Razvija kvadricepse, lože i gluteus. Spuštati se do paralele ili niže, držeći težinu na petama i ispravljena leđa.',
    imageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Squat/0.jpg'
  },
  {
    name: 'Rumunsko mrtvo dizanje',
    category: 'Noge',
    description: 'Primarno pogađa zadnju ložu (hamstrings) i gluteus. Gurati kukove unazad dok spuštate šipku niz noge uz minimalno savijanje u kolenima.',
    imageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Romanian_Deadlift/0.jpg'
  },
  {
    name: 'Iskoraci sa bučicama',
    category: 'Noge',
    description: 'Odlična dinamička vežba za stabilnost, kvadricepse i gluteus. Paziti da koleno prednje noge prilikom iskoraka ne prelazi liniju prstiju.',
    imageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Lunges/0.jpg'
  },

  // --- RAMENA ---
  {
    name: 'Vojnički potisak (Military Press)',
    category: 'Ramena',
    description: 'Potisak dvoručnim tegom iznad glave u stojećem stavu. Angažuje prednje rame, triceps i zahteva snažnu stabilizaciju celog jezgra.',
    imageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Shoulder_Press/0.jpg'
  },
  {
    name: 'Lateralno podizanje bučicama',
    category: 'Ramena',
    description: 'Izolaciona vežba za srednju glavu deltoida koja daje ramenima širinu i vizuelni "V-taper" oblik. Podizati laktove do visine ramena.',
    imageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Side_Lateral_Raise/0.jpg'
  },

  // --- RUKE ---
  {
    name: 'Biceps pregib dvoručnim tegom',
    category: 'Ruke',
    description: 'Zlatni standard za izgradnju mase i snage bicepsa. Držati laktove fiksirane uz telo i izbegavati njihovo pomeranje unapred.',
    imageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Curl/0.jpg'
  },
  {
    name: 'Triceps ekstenzija na sajli',
    category: 'Ruke',
    description: 'Potisak nadole sa sajlom za izolaciju spoljašnje glave tricepsa. Opružiti ruke do kraja i snažno stisnuti triceps na dnu.',
    imageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Triceps_Pushdown/0.jpg'
  },

  // --- TRBUŠNJACI ---
  {
    name: 'Klasični trbušnjaci (Crunches)',
    category: 'Trbušnjaci',
    description: 'Osnovna vežba za kontrakciju gornjeg dela pravog trbušnog mišića. Podizati samo lopatice sa poda, bez vučenja vrata rukama.',
    imageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Crunches/0.jpg'
  },
  {
    name: 'Plank (Izdržaj)',
    category: 'Trbušnjaci',
    description: 'Izometrijska vežba za stabilnost kompletnog jezgra. Oslonac je na podlakticama i prstima nogu, a stomak i gluteus moraju biti stegnuti.',
    imageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Plank/0.jpg'
  }
];

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Exercise.deleteMany();
    console.log('Stari linkovi obrisani...');
    await Exercise.insertMany(exercises);
    console.log('--- USPEH: Sve slike su uspešno osvežene i popravljene! ---');
    process.exit();
  } catch (error) {
    console.error('Greška:', error);
    process.exit(1);
  }
};

importData();