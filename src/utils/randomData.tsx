import { v4 } from "uuid";
import { BRANCH_TYPES } from "./branchTypes";
import { BRANCH_LOCATIONS } from "./branchLocations";
import { loremIpsum, name, surname, fullname } from "react-lorem-ipsum";
import {
  Tier,
  Duration,
  UserRole,
  LocalTime,
  TableInterace,
  ClientInterface,
  BranchInterface,
  BusinessInterface,
  DefaultTaxInterface,
  GuestInterface,
  TaxInterface,
  SaleProductInterface,
  SaleInterface,
  BranchReservesStatsInterface,
  BranchSaleStatsInterface,
  BranchProductStatsInterface,
} from "@objects";

const PHONES = ["0424", "0414", "0412", "0416"];
const TAXES_NAME = ["IVA", "ISLR", "IGTF", "IPostel"];
const ADDRESSES = [
  "80999 Riggs Forest Suite 844",
  "Brendaside, MS 90559",
  "15255 Brandi Mission",
  "Harrisshire, MP 21566",
  "61435 James Villages",
  "Kathleenbury, MI 23137",
  "691 Rivera Radial Apt. 102",
  "Saraburgh, AR 94421",
  "4806 Harris Prairie",
  "North Katiebury, SC 04726",
  "11930 Tyler Ridge Suite 016",
  "Spenceview, IN 41251",
  "218 Garza Shores Suite 370",
  "Port Catherineborough, PW 47259",
  "87545 Chad Mount",
  "Lake Jenniferview, ND 17335",
  "1261 Andrea Streets Apt. 480",
  "Mollyton, AZ 07732",
  "91268 Mitchell Brook Apt. 966",
  "Smithbury, WA 09485",
  "9609 Julia Track",
  "East Patriciaville, FM 32940",
  "278 William Forges Suite 678",
  "Michellestad, SC 25689",
  "87431 William Creek Apt. 666",
  "Joshuaport, NY 15303",
  "7373 Maria Extension",
  "East Erinport, IL 59808",
  "82537 Gloria Crossroad Apt. 248",
  "Duranfurt, FM 51860",
  "8226 Moore Viaduct Apt. 494",
  "North Dustinton, LA 98612",
  "650 Ryan Village Suite 304",
  "South Janetchester, NV 53338",
  "2308 Tom Falls",
  "Brianshire, RI 59953",
  "18874 Davis Alley Suite 412",
  "Russellville, RI 45263",
  "075 Webb Burg Suite 984",
  "West Rachelborough, HI 25011",
  "907 Patterson Court Suite 323",
  "Brownbury, CT 78324",
  "4083 Wilson Freeway Suite 846",
  "New Laura, NH 30835",
  "3342 Deborah Pine Suite 053",
  "North Kevin, KS 60170",
  "73785 Christopher Mountains Suite 722",
  "West Pamelaton, ND 98819",
  "1718 Timothy Drives",
  "Lake Joseph, VA 41668",
  "74808 Melissa Lights Apt. 789",
  "Kristinmouth, WI 33067",
  "94003 Avila Valley",
  "West Joseph, HI 76354",
  "9645 Ball Via",
  "North Henryview, MT 61195",
  "32640 Nichole Rapids Apt. 848",
  "Jacobschester, NY 49949",
  "904 Lewis Oval",
  "Kerryfurt, MP 10528",
  "USNS Bishop",
  "FPO AA 99810",
  "PSC 3094, Box 9535",
  "APO AE 82748",
  "114 Scott Shoal Apt. 749",
  "North Tammyville, MA 43248",
  "5859 Combs Branch Suite 400",
  "West Jessicaside, MT 24239",
  "093 Joel Centers",
  "East Jamesmouth, GU 22685",
  "Unit 3145 Box 0482",
  "DPO AE 39724",
  "0291 Lisa Inlet Suite 876",
  "East Jerry, MO 20643",
  "635 Allison Drive",
  "Coxberg, PW 56242",
  "23142 Massey Mall",
  "Thomasmouth, IA 87505",
  "83902 Downs Square",
  "North Michaelville, PW 01462",
  "85472 Justin Junctions Suite 910",
  "Port Brian, VT 99784",
  "3433 Jackson Shore Suite 364",
  "Camposmouth, HI 94138",
  "41832 Crystal Causeway Suite 107",
  "Joshuamouth, NV 44449",
  "1514 Burke Fords Suite 037",
  "Beckberg, OH 32773",
  "942 Ashley Points",
  "East Katelyn, DC 05312",
  "7681 Potter Crossroad",
  "East Annaville, CO 71111",
  "9535 Bradley Course Apt. 144",
  "Maddenbury, MS 84797",
  "13041 Romero Walks Suite 622",
  "Haroldberg, TX 72369",
  "USNS Green",
  "FPO AE 15598",
  "2733 Melton Tunnel Apt. 874",
  "Pruittborough, PA 97025",
  "8048 Miller Radial Suite 123",
  "New Christina, OH 29336",
  "96001 Lucero Groves Apt. 780",
  "East Scottborough, FM 45318",
  "10561 Carroll Lock",
  "Lake Brett, MP 63505",
  "61200 Conner Highway",
  "North Nancyton, MH 01345",
  "95065 Brianna Union",
  "Jeffport, CT 76453",
  "2885 Scott Mountain",
  "North Brian, AR 05087",
  "1454 Kent Run Suite 834",
  "East Gregory, FL 41513",
  "1809 Amanda Summit",
  "Donnabury, CT 03958",
  "USNV Watts",
  "FPO AE 07853",
  "09670 Chandler Springs",
  "Beantown, MI 07244",
  "55354 Angela Plain Apt. 391",
  "Lake Michelle, DC 99741",
  "950 Nancy Streets Apt. 705",
  "Phelpsmouth, NY 08980",
  "54001 Cox Harbor Suite 205",
  "Port Danielle, DE 48952",
  "86928 Gibson Forest Apt. 976",
  "Port Victorialand, HI 59849",
  "7974 Margaret Center",
  "Burnsport, TN 84347",
  "739 Murphy Road",
  "New Nataliemouth, PR 50535",
  "62239 Stephanie Pass",
  "New Madelineside, MO 23399",
  "52552 Richard Mountains",
  "Lake Jennifer, MD 85028",
  "31367 Veronica Mountain Apt. 460",
  "Port Renee, MA 87767",
  "78052 Katherine Glen Apt. 794",
  "West Danielchester, ND 46793",
  "3836 Michael Via",
  "Morganbury, CO 04250",
  "0547 Zamora Ferry Apt. 524",
  "West Davidton, VA 74321",
  "4948 Samantha Stravenue",
  "Matthewfort, VI 26590",
  "02220 Jessica Flats",
  "East Justinchester, ID 63314",
  "789 Nguyen Spurs Apt. 347",
  "Claytonborough, GA 10720",
  "34328 Michael Roads Apt. 146",
  "West Tanner, MA 48846",
  "8006 Keith Trace Apt. 253",
  "South Shelby, MP 21795",
  "002 Dyer Stream Suite 190",
  "East Samuel, MN 33020",
  "785 Julie Roads",
  "Lake Holly, MN 91734",
  "73994 Martinez Flat Apt. 306",
  "Benjaminfort, MN 08711",
  "066 Hawkins Oval",
  "Conleyburgh, VA 27676",
  "262 Hall Fields",
  "Ibarraborough, MT 10822",
  "3473 George Ferry",
  "Johnsontown, MO 82954",
  "5628 Richard Flat",
  "Jamesport, MN 77933",
  "80388 Frank Walks",
  "Jordanton, NV 95033",
  "87151 Pamela Pike",
  "New Jennifer, NE 37011",
  "62707 Beth Path",
  "Lawrencefort, AL 52188",
  "93525 Higgins Pine",
  "East Ronaldstad, CO 30730",
  "25361 Tina Radial Suite 891",
  "Lake Megan, HI 10690",
  "81491 Rogers Skyway",
  "Port Amy, TN 18227",
  "9102 Mark Mission",
  "Port Josephbury, NM 06934",
  "85306 Ellis Mountain Suite 026",
  "Port Robert, MO 04056",
  "24376 Stephen Track Apt. 378",
  "Stevensbury, MP 22032",
  "1419 Jonathan Bridge Apt. 114",
  "New Claytonfurt, ME 98056",
  "8162 Hendricks Loaf",
  "Browntown, AL 77527",
  "USNS Lee",
  "FPO AP 86135",
  "Unit 5310 Box 6706",
  "DPO AP 42665",
  "2271 Ponce Track Suite 643",
  "Youngton, NY 34278",
  "27771 Sarah Lock Apt. 729",
  "New John, UT 20578",
  "654 Lawrence Port",
  "Wendyside, MN 41554",
];
const BRANCHE_NAMES = [
  "Sabores del Mar",
  "Café de la Plaza",
  "El Jardín Escondido",
  "La Cocina de la Abuela",
  "Bocado Celestial",
  "Rincón Gourmet",
  "Delicias Andinas",
  "Sabor Tropical",
  "Casa del Sol",
  "El Paladar Exquisito",
  "La Pizzería de Luigi",
  "Bistro Elegante",
  "El Asador de Juan",
  "La Parrilla del Chef",
  "El Oasis Vegetariano",
  "La Trattoria Auténtica",
  "El Bodegón Criollo",
  "La Cuchara Dorada",
  "El Refugio del Sibarita",
  "La Taberna del Gourmet",
];
const PRODUCT_NAMES = [
  "Ensalada César",
  "Pizza Margherita",
  "Hamburguesa de ternera",
  "Sopa de pollo",
  "Pasta Carbonara",
  "Sushi de atún",
  "Tacos de carnitas",
  "Paella Valenciana",
  "Filete a la pimienta",
  "Pollo Tikka Masala",
  "Mojito",
  "Margarita",
  "Café Americano",
  "Té verde",
  "Batido de fresa",
  "Jugo de naranja",
  "Cerveza rubia",
  "Vino tinto Merlot",
  "Agua mineral",
  "Refresco de cola",
  "Tarta de manzana",
  "Helado de vainilla",
  "Brownie de chocolate",
  "Flan de huevo",
  "Pastel de queso",
  "Mousse de limón",
  "Galletas de avena",
  "Tiramisú",
  "Crepes con Nutella",
  "Fruta fresca",
];
const IMAGES = [
  "https://th.bing.com/th/id/R.0dd2e89abaafdedb2553d215359b4237?rik=6abZ%2bYNGczRriQ&riu=http%3a%2f%2fwww.trbimg.com%2fimg-5b8f2874%2fturbine%2fsd-et-dining-inside-out-20180801&ehk=8MSHG4Zn4vWV8BV0%2fUY7%2bhHvDgUHF3rrJ%2bGoaYvH8Qg%3d&risl=&pid=ImgRaw&r=0",
  "https://th.bing.com/th/id/R.8609a0e548432f55343dea90b7a30ca3?rik=UtoLG409Pt2%2btQ&pid=ImgRaw&r=0",
  "https://nbcconferencecentre.com/content/uploads/sites/2/2018/02/2017121400120-RubenMay-_RU18490.jpg",
  "https://th.bing.com/th/id/R.63fd2fb897e2be052f18f0e4d2aeae90?rik=LkXVO5j%2fFYU4tw&riu=http%3a%2f%2fwww.frogpondvillage.com%2fwp-content%2fuploads%2f2019%2f06%2f155.jpg&ehk=JZmlD1dxG3D7bHojY3SwgkWW3WC8jKL%2b0G2HRBL2vaM%3d&risl=&pid=ImgRaw&r=0",
  "https://thearchitectsdiary.com/wp-content/uploads/2018/06/Best-Restaurant-Interior-Design-In-India-4.jpg",
  "https://wallpapercave.com/wp/wp2038281.jpg",
  "https://i.pinimg.com/originals/78/a9/66/78a9668410539c6addfc3d0325d3d445.jpg",
  "https://media.architecturaldigest.com/photos/572a34ffe50e09d42bdfb5e0/master/pass/japanese-restaurants-la-01.jpg",
  "https://media.architecturaldigest.com/photos/5b04347ca7a427430454e50f/master/pass/GettyImages-182977836.jpg",
  "https://p4.wallpaperbetter.com/wallpaper/386/534/411/restaurant-cafe-appliances-tables-wallpaper-preview.jpg",
  "https://img.caminofinancial.com/wp-content/uploads/2019/03/08003212/iStock-1073667618.jpg",
  "https://momento24.co/wp-content/uploads/2020/08/Restaurantes-2.jpg",
  "https://i.pinimg.com/originals/b9/2e/f8/b92ef8b0fbdd368d67a9733081a99250.jpg",
  "https://www.hyattrestaurants.com/uploaded/restaurant_banners/restaurant_banner-1588619256.jpg",
  "http://static7.depositphotos.com/1021014/788/i/450/depositphotos_7888144-stock-photo-interior-of-restaurant.jpg",
];

export const randomToken = () => v4();

export const randomSubArray = <T extends any>(array: T[], n: number) => {
  const copy = array.slice();
  const result = [];

  for (let i = 0; i < n; i++) {
    const randomIndex = Math.floor(Math.random() * copy.length);
    const element = copy[randomIndex];
    result.push(element);

    copy.splice(randomIndex, 1);
  }

  return result;
};

export const randomPhoneNumber = () => {
  return `${PHONES[Math.floor(Math.random() * PHONES.length)]}${Math.floor(
    Math.random() * 90000000 + 1000000
  )}`;
};

export const randomLocalTime = (): LocalTime => {
  const hour = Math.floor(Math.random() * 24)
    .toString()
    .padStart(2, "0");
  const minute = Math.floor(Math.random() * 60)
    .toString()
    .padStart(2, "0");
  const second = Math.floor(Math.random() * 60)
    .toString()
    .padStart(2, "0");

  return `${hour}:${minute}:${second}` as LocalTime;
};

export const randomDuration = (): Duration => {
  const hour = Math.floor(Math.random() * 24)
    .toString()
    .padStart(2, "0");
  const minute = Math.floor(Math.random() * 60)
    .toString()
    .padStart(2, "0");
  const second = Math.floor(Math.random() * 60)
    .toString()
    .padStart(2, "0");

  return `PT${hour}H${minute}M${second}S` as Duration;
};

export const randomTimestamp = (min?: Date) => {
  return new Date(
    Math.floor(Math.random() * (Date.now() - (min?.getTime() ?? 0))) +
      (min?.getTime() ?? 0)
  );
};

export const randomClient = (userId?: number): ClientInterface => {
  return {
    id: Math.floor(Math.random() * 100000),
    userId: userId || Math.floor(Math.random() * 100000),
    name: name(),
    surname: surname(),
    stripeCustomerId: v4(),
    phoneNumber: randomPhoneNumber(),
    dateOfBirth: `${Math.floor(Math.random() * 30 + 1)}/${Math.floor(
      Math.random() * 11 + 1
    )}/${Math.floor(Math.random() * 20 + 1980)}`,
    address: ADDRESSES[Math.floor(Math.random() * ADDRESSES.length)],
  };
};

export const randomBusiness = (userId?: number): BusinessInterface => {
  return {
    id: Math.floor(Math.random() * 100000),
    userId: userId || Math.floor(Math.random() * 100000),
    name: fullname(),
    tier: Object.values(Tier)[Math.floor(Math.random() * Object.values(Tier).length)],
    verified: Math.random() > 0.5,
    phoneNumber: `${PHONES[Math.floor(Math.random() * PHONES.length)]}${Math.floor(
      Math.random() * 90000000 + 1000000
    )}`,
  };
};

export const randomLoginResponse = (client?: boolean) => {
  const isClient = client ?? Math.random() > 0.5;
  const id = Math.floor(Math.random() * 100000);

  return {
    id,
    token: v4(),
    refresh: v4(),
    role: isClient ? UserRole.CLIENT : UserRole.BUSINESS,
    client: isClient ? randomClient(id) : undefined,
    business: isClient ? undefined : randomBusiness(id),
  };
};

export const randomDefaultTax = (businessId?: number): DefaultTaxInterface => {
  const isPercentage = Math.random() > 0.5;

  return {
    id: Math.floor(Math.random() * 100000),
    businessId: businessId || Math.floor(Math.random() * 100000),
    name: TAXES_NAME[Math.floor(Math.random() * TAXES_NAME.length)],
    value: isPercentage ? Math.floor(Math.random() * 20) : Math.floor(Math.random() * 50),
    isPercentage,
  };
};

export const randomTax = (): TaxInterface => {
  const isPercentage = Math.random() > 0.5;

  return {
    id: Math.floor(Math.random() * 100000),
    name: TAXES_NAME[Math.floor(Math.random() * TAXES_NAME.length)],
    value: isPercentage ? Math.floor(Math.random() * 20) : Math.floor(Math.random() * 50),
    isPercentage,
  };
};

export const randomBranch = (businessId?: number): BranchInterface => ({
  id: Math.floor(Math.random() * 100000),
  businessId: businessId || Math.floor(Math.random() * 100000),
  name: BRANCHE_NAMES[Math.floor(Math.random() * BRANCHE_NAMES.length)],
  score: Math.floor(Math.random() * 5),
  capacity: Math.floor(Math.random() * 100),
  reservationPrice: Math.random() * 100 + 1,
  mapsLink: "",
  location: BRANCH_LOCATIONS[Math.floor(Math.random() * BRANCH_LOCATIONS.length)],
  overview: loremIpsum({ p: 1, random: true })[0],
  visibility: Math.random() > 0.2,
  reserveOff: Math.random() > 0.2,
  phoneNumber: randomPhoneNumber(),
  type: BRANCH_TYPES[Math.floor(Math.random() * BRANCH_TYPES.length)],
  hourIn: randomLocalTime(),
  hourOut: randomLocalTime(),
  averageReserveTime: randomDuration(),
  dollarExchange: Math.floor(Math.random() * 10 + 30),
  deleted: false,
  defaultTaxes: new Array(Math.floor(Math.random() * 5 + 1))
    .fill(0)
    .map(() => randomDefaultTax()),
});

export const randomTable = (branchId?: number): TableInterace => ({
  id: Math.floor(Math.random() * 100000),
  name: Math.floor(Math.random() * 1000)
    .toString()
    .padStart(4, "0"),
  branchId: branchId || Math.floor(Math.random() * 100000),
});

export const randomGuest = (): GuestInterface => ({
  id: Math.floor(Math.random() * 100000),
  name: name(),
  surname: surname(),
  phoneNumber: randomPhoneNumber(),
  email: `${name()}.${surname()}@gmail.com`,
  identityDocument: "V-" + Math.floor(Math.random() * 90000000 + 10000000).toString(),
});

export const randomSaleProduct = (
  saleId?: number,
  productId?: number
): SaleProductInterface => ({
  id: Math.floor(Math.random() * 100000),
  saleId: saleId || Math.floor(Math.random() * 100000),
  productId: productId || Math.floor(Math.random() * 100000),
  name: PRODUCT_NAMES[Math.floor(Math.random() * PRODUCT_NAMES.length)],
  amount: Math.floor(Math.random() * 10 + 1),
  price: Math.floor(Math.random() * 100 + 1),
});

export const randomSale = (
  branchId?: number,
  tables?: TableInterace[]
): SaleInterface => {
  const isClient = Math.random() > 0.5;
  const client = isClient ? randomClient() : undefined;
  const guest = isClient ? undefined : randomGuest();
  const startTime = randomTimestamp();
  const endTime = randomTimestamp(startTime);
  const insite = Math.random() > 0.2;

  let saleTables: TableInterace[] = [];
  if (!!tables && tables.length > 0) {
    saleTables = randomSubArray(
      tables,
      Math.floor(Math.random() * Math.min(5, tables.length) + 1)
    );
  } else {
    saleTables = new Array(Math.floor(Math.random() * 5 + 1))
      .fill(0)
      .map(() => randomTable(branchId));
  }

  return {
    sale: {
      id: Math.floor(Math.random() * 100000),
      branchId: branchId || Math.floor(Math.random() * 100000),
      clientGuestId: Math.floor(Math.random() * 100000),
      invoiceId: Math.floor(Math.random() * 100000),
      clientQuantity: Math.floor(Math.random() * 10 + 1),
      status: Math.floor(Math.random() * 5),
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      dollarExchange: Math.floor(Math.random() * 10 + 30),
      note: loremIpsum({ p: 1, random: true })[0],
    },
    insite: Math.random() > 0.5,
    guest,
    client,
    reservationId: Math.floor(Math.random() * 100000),
    taxes: new Array(Math.floor(Math.random() * 5 + 1)).fill(0).map(() => randomTax()),
    tables: insite ? saleTables : [],
    products: new Array(Math.floor(Math.random() * 5 + 1))
      .fill(0)
      .map(() => randomSaleProduct()),
  };
};

export const randomImages = (n: number = 5) => {
  return randomSubArray(IMAGES, n);
};

export const randomBranchReservesStats = (): BranchReservesStatsInterface => ({
  pending: Math.floor(Math.random() * 50),
  approved: Math.floor(Math.random() * 30),
  active: Math.floor(Math.random() * 15),
  percentageFull: Math.floor(Math.random() * 100),
});

export const randomBranchYearStats = (): BranchSaleStatsInterface[] => {
  const result: BranchSaleStatsInterface[] = [];

  const currentDate = new Date();
  let currentValue = Math.random() * 1000;
  currentDate.setDate(currentDate.getDate() - 365);
  for (let i = 0; i < 366; i++) {
    currentValue = Math.max(0, currentValue + Math.random() * 150 - 70);
    result.push({
      date: currentDate.toISOString(),
      total: currentValue,
      sales: Math.floor(currentValue / (Math.random() * 3 + 10)),
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return result;
};

export const randomBestBranchProductStats = (
  period: number
): BranchProductStatsInterface[] => {
  const productos = randomSubArray(PRODUCT_NAMES, 5);
  const result: BranchProductStatsInterface[] = [];

  const base = period * 35;
  const variation = period * 7;

  for (let i = 0; i < productos.length; i++) {
    const sales = Math.floor(Math.random() * variation + base);
    result.push({
      name: productos[i],
      sales,
      total: sales * (Math.random() * 3 + 5),
    });
  }
  result.sort((a, b) => b.sales - a.sales);

  return result;
};
