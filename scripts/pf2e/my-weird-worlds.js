export const hookWeirdWorld = () => {
  game.settings.register('shemetz-macros', 'the-whole-world', {
    name: `Weird worldbuilding in The Whole World`,
    hint: `my custom campaign stuff`,
    scope: 'world',
    config: false,
    type: Boolean,
    default: false,
  })

  if (game.settings.get('shemetz-macros', 'the-whole-world') !== true) {
    return
  }

  CONFIG.time.worldCalendarConfig = {
    ...CONFIG.time.worldCalendarConfig,
    name: 'Wholey Gregian',
    description: 'Shemetz\'s custom campaign calendar',
    years: {
      yearZero: 0,
      firstWeekday: 0,
      leapYear: {
        leapStart: 8,
        leapInterval: 4,
      },
    },
    months: {
      values: [
        { name: 'Jember', abbreviation: 'Jem', ordinal: 1, days: 31 },
        { name: 'Febroctougust', abbreviation: 'Feb', ordinal: 2, days: 28, leapDays: 29 },
        { name: 'Manber', abbreviation: 'Man', ordinal: 3, days: 31 },
        { name: 'Ay', abbreviation: 'Ay', ordinal: 4, days: 30 },
        { name: 'Mulypril', abbreviation: 'Mul', ordinal: 5, days: 31 },
        { name: 'Juneuary', abbreviation: 'Jun', ordinal: 6, days: 30 },
        { name: 'Julyber', abbreviation: 'Jul', ordinal: 7, days: 31 },
        { name: 'Auary', abbreviation: 'Aua', ordinal: 8, days: 31 },
        { name: 'Septuneber', abbreviation: 'Sep', ordinal: 9, days: 30 },
        { name: 'Octorch', abbreviation: 'Oct', ordinal: 10, days: 31 },
        { name: 'Novoctopril', abbreviation: 'Nov', ordinal: 11, days: 30 },
        { name: 'Decany', abbreviation: 'Dec', ordinal: 12, days: 31 },
      ],
    },
    days: {
      values: [
        { name: 'Sonday', abbreviation: 'Son', ordinal: 1 },
        { name: 'Arcsday', abbreviation: 'Arc', ordinal: 2 },
        { name: 'Gashday', abbreviation: 'Gsh', ordinal: 3 },
        { name: 'Spinsday', abbreviation: 'Spn', ordinal: 4 },
        { name: 'Gibbday', abbreviation: 'Gib', ordinal: 5 },
        { name: 'Eaveday', abbreviation: 'Eav', ordinal: 6, isRestDay: true },
        { name: 'Daughterday', abbreviation: 'Dtr', ordinal: 7, isRestDay: true },
      ],
      // disabled for now because pf2e system doesn't really support it
      //daysPerYear: 365 * 7, // !
      daysPerYear: 365,
      //hoursPerDay: 24 / 7, // ! 3.428571...
      hoursPerDay: 24,
      minutesPerHour: 60,
      secondsPerMinute: 60,
    },
  }
  CONFIG.PF2E.worldClock.AR = {
    ...CONFIG.PF2E.worldClock.AR,
    Era: '(BC)',
    Months: {
      January: 'Jember',
      February: 'Febroctougust',
      March: 'Manber',
      April: 'Ay',
      May: 'Mulypril',
      June: 'Juneuary',
      July: 'Julyber',
      August: 'Auary',
      September: 'Septuneber',
      October: 'Octorch',
      November: 'Novoctopril',
      December: 'Decany',
    },
    Weekdays: {
      Sunday: 'Sonday',
      Monday: 'Arcsday',
      Tuesday: 'Gashday',
      Wednesday: 'Spinsday',
      Thursday: 'Gibbday',
      Friday: 'Eaveday',
      Saturday: 'Daughterday',
    },
  }

}