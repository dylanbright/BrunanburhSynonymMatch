// Word pool drawn from "Brunanburh Synonym Clusters" — Old English near-synonym
// clusters from The Battle of Brunanburh. Each word points at the `image` id of
// the concept that illustrates its meaning (see IMAGES below).

const WORD_POOL = [
  // Warrior / Fighting Man
  { oe: "eorla", lit: "earls, nobles", image: "warrior", context: "“eorla dryhten” — lord of earls" },
  { oe: "beorna", lit: "men, warriors", image: "warrior", context: "“beorna beahgifa” — ring-giver of men" },
  { oe: "secga", lit: "men, warriors", image: "warrior", context: "“secga swate”" },
  { oe: "guma", lit: "man", image: "warrior", context: "“guma norþerna” — the northern man" },
  { oe: "gumena", lit: "of men", image: "warrior", context: "“gumena gemotes” — meeting of men" },
  { oe: "hæleþa", lit: "heroes", image: "warrior", context: "“hæleþa nanum”" },
  { oe: "beorn", lit: "man, warrior", image: "warrior", context: "“beorn blandenfeax” — the grey-haired warrior" },
  { oe: "hilderinc", lit: "battle-warrior", image: "warrior", context: "“har hilderinc” — the hoary war-man" },
  { oe: "wigsmiþas", lit: "war-smiths", image: "warrior", context: "“wlance wigsmiþas” — proud war-smiths" },
  { oe: "eorlas", lit: "earls", image: "warrior", context: "“eorlas Anlafes”" },

  // Battle / Combat
  { oe: "sæcce", lit: "battle, strife", image: "battle", context: "“geslogon æt sæcce”" },
  { oe: "campe", lit: "battle, combat", image: "battle", context: "“æt campe oft” — often in battle" },
  { oe: "wiges", lit: "war, battle", image: "battle", context: "“wiges sæd”" },
  { oe: "wiga", lit: "war, battle", image: "battle", context: "“wiges hremige”" },
  { oe: "gefeohte", lit: "fight", image: "battle", context: "“fæge to gefeohte” — fated to the fight" },
  { oe: "guðe", lit: "war, battle", image: "battle", context: "“giungne æt guðe”" },
  { oe: "hondplegan", lit: "hand-play", image: "battle", context: "“heardes hondplegan”" },
  { oe: "bilgeslehtes", lit: "blade-clash", image: "battle", context: "“bilgeslehtes”" },
  { oe: "beaduweorca", lit: "battle-deeds", image: "battle", context: "“beaduweorca beteran”" },
  { oe: "cumbolgehnastes", lit: "banner-clash", image: "battle", context: "a triple restatement of “battle”" },
  { oe: "garmittinge", lit: "spear-meeting", image: "battle", context: "a triple restatement of “battle”" },
  { oe: "wæpengewrixles", lit: "weapon-exchange", image: "battle", context: "a triple restatement of “battle”" },

  // Sword / Blade
  { oe: "sweorda", lit: "swords (plain)", image: "sword", context: "“sweorda ecgum” — with sword-edges" },
  { oe: "sweordes", lit: "swords (plain)", image: "sword", context: "“sweorda ecgum”" },
  { oe: "hamora lafan", lit: "the hammers' leavings", image: "sword", context: "kenning for a sword" },
  { oe: "mecum mylenscearpan", lit: "mill-sharpened blades", image: "sword", context: "grindstone-sharpened swords" },
  { oe: "sweordum", lit: "swords", image: "sword", context: "“sweordum aswefede”" },

  // To Fall / Die in Battle
  { oe: "crungun", lit: "fell, perished", image: "fallen", context: "“Hettend crungun” — the attackers fell" },
  { oe: "feollan", lit: "fell", image: "fallen", context: "“fæge feollan” — the doomed fell" },
  { oe: "læg", lit: "lay (dead)", image: "fallen", context: "“þær læg secg mænig”" },
  { oe: "lægun", lit: "lay (dead)", image: "fallen", context: "“þær læg secg mænig”" },
  { oe: "aswefede", lit: "put to sleep", image: "fallen", context: "“sweordum aswefede”" },
  { oe: "gefylled", lit: "felled", image: "fallen", context: "“freonda gefylled”" },
  { oe: "ageted", lit: "destroyed, cut down", image: "fallen", context: "“garum ageted”" },

  // King / Ruler
  { oe: "cyning", lit: "king", image: "king", context: "Æthelstan; also Anlaf; Edmund" },
  { oe: "æþeling", lit: "prince, heir", image: "king", context: "Edmund the ætheling" },
  { oe: "dryhten", lit: "lord", image: "king", context: "“eorla dryhten”" },
  { oe: "bregu", lit: "prince, chieftain", image: "king", context: "“Norðmanna bregu”" },

  // Ship
  { oe: "scipflotan", lit: "ship-floaters, seamen", image: "ship", context: "“Sceotta leoda and scipflotan”" },
  { oe: "lides", lit: "ship's", image: "ship", context: "“lides bosme” — ship's bosom" },
  { oe: "cnear", lit: "small ship", image: "ship", context: "“cread cnear on flot”" },
  { oe: "negledcnearrum", lit: "nailed ships", image: "ship", context: "“Norþmen negledcnearrum”" },

  // Flight / Fleeing
  { oe: "herefleman", lit: "army-fugitives", image: "flight", context: "“heowan herefleman”" },
  { oe: "fleame", lit: "flight", image: "flight", context: "“mid fleame com”" },
  { oe: "geflemed", lit: "put to flight", image: "flight", context: "“þær geflemed wearð”" },

  // Beasts of Battle
  { oe: "sweartan hræfn", lit: "the black raven", image: "raven", context: "“þone sweartan hræfn”" },
  { oe: "guðhafoc", lit: "war-hawk", image: "eagle", context: "“grædigne guðhafoc”" },
  { oe: "earn", lit: "eagle", image: "eagle", context: "“earn æftan hwit”" },
  { oe: "wulf", lit: "wolf", image: "wolf", context: "“wulf on wealde”" },
];

// Image concepts the words map to. `src` is a placeholder now — swap the
// files in images/ for real illustrations later; keep the same filenames
// (or edit `src` here) and the game picks them up automatically.
const IMAGES = [
  { id: "warrior", name: "Warrior", src: "images/warrior.svg" },
  { id: "battle", name: "Battle", src: "images/battle.svg" },
  { id: "sword", name: "Sword", src: "images/sword.svg" },
  { id: "fallen", name: "Fallen in Battle", src: "images/fallen.svg" },
  { id: "king", name: "King / Ruler", src: "images/king.svg" },
  { id: "ship", name: "Ship", src: "images/ship.svg" },
  { id: "flight", name: "Flight / Fleeing", src: "images/flight.svg" },
  { id: "raven", name: "Raven", src: "images/raven.svg" },
  { id: "eagle", name: "Eagle", src: "images/eagle.svg" },
  { id: "wolf", name: "Wolf", src: "images/wolf.svg" },
];
