import type { Locale } from "@/lib/site";

type Text = Record<Locale, string>;

export type Game = {
  slug: string;
  name: string;
  accent: string;
  /** Accent readable as text on the dark ground. */
  label: string;
  onAccent: string;
  platform: "android" | "web";
  status: Text;
  genre: Text;
  tagline: Text;
  short: Text;
  about: Record<Locale, string[]>;
  features: Record<Locale, [string, string][]>;
  icon: string;
  keyArt: string;
  /** Where a cropped key art keeps its focus (CSS object-position), when the title sits off-centre. */
  keyArtPos?: string;
  /** Screens in the media rail; `wide` ones are landscape. */
  media: string[];
  wide?: boolean;
  trailer?: string;
  /** A trailer hosted with the site (16:9 mp4), for games whose video is not on YouTube yet. */
  trailerFile?: string;
  playPackage?: string;
  /** Announced but not in testing yet: the home list says "Coming soon" instead of "In testing". */
  soon?: boolean;
  /** true once the Google Play page is public; until then the badge offers the test by email. */
  storeLive?: boolean;
  playUrl?: string;
  privacy?: string;
  info: Record<Locale, [string, string][]>;
};

const androidInfo = (vi: boolean, live = false): [string, string][] =>
  vi
    ? [["Nền tảng", "Android, trên Google Play"], ["Giá", "Miễn phí · có quảng cáo · mua trong ứng dụng"], ["Người chơi", "1"],
       ["Ngôn ngữ", "English, Tiếng Việt"], ["Trạng thái", live ? "Đã có trên Google Play" : "Đang thử nghiệm trên Google Play"], ["Nhà phát triển", "Bill The Dev"]]
    : [["Platform", "Android, on Google Play"], ["Price", "Free · contains ads · in-app purchases"], ["Players", "1"],
       ["Languages", "English, Tiếng Việt"], ["Status", live ? "Out now on Google Play" : "Testing on Google Play"], ["Developer", "Bill The Dev"]];

/** The eight captioned Google Play screens. */
const playShots = (slug: string) => [1, 2, 3, 4, 5, 6, 7, 8].map((n) => `/img/games/${slug}/play${n}.jpg`);

export const GAMES: Game[] = [
  {
    slug: "meh-merge", name: "Meh Merge", accent: "#B7A6FF", label: "#B7A6FF", onAccent: "#111111", platform: "android",
    status: { en: "Android · on Google Play", vi: "Android · đã có trên Google Play" },
    genre: { en: "Drop and merge puzzle", vi: "Puzzle thả và gộp" },
    tagline: { en: "Two mehs make a bigger meh.", vi: "Hai meh gộp thành meh to hơn." },
    short: { en: "Drop balls in a jar. Two the same merge into a bigger one. Chain combos and don't let it fill up.",
             vi: "Thả bóng vào lọ. Hai quả giống nhau gộp thành quả to hơn. Nối combo và đừng để lọ đầy." },
    about: {
      en: ["Drop balls into a jar. Two the same merge into a bigger one, and the jar slowly fills up.",
           "Every drop is a small plan: where it lands decides what merges next. Keep the chain going and don't let it reach the top."],
      vi: ["Thả bóng vào lọ. Hai quả giống nhau gộp thành quả to hơn, và lọ cứ đầy dần.",
           "Mỗi lần thả là một tính toán nhỏ: rơi chỗ nào quyết định quả nào gộp tiếp. Giữ chuỗi gộp và đừng để chạm miệng lọ."],
    },
    features: {
      en: [["Drop and merge", "Two balls the same become a bigger one. Pick where each one lands."], ["Chain combos", "One merge can set off the next. Long chains, big scores."], ["Coins and skins", "Earn coins as you play and unlock new looks."]],
      vi: [["Thả và gộp", "Hai quả giống nhau thành một quả to hơn. Chọn chỗ thả cho từng quả."], ["Chuỗi combo", "Một lần gộp kéo theo lần sau. Chuỗi dài, điểm cao."], ["Xu và skin", "Kiếm xu khi chơi và mở khoá giao diện mới."]],
    },
    icon: "/img/games/meh-merge/icon.png", keyArt: "/img/games/meh-merge/feature.jpg", media: playShots("meh-merge"),
    trailer: "M3JXoXfuPvw", playPackage: "com.billthedev.mehmerge", storeLive: true, privacy: "/privacy/meh-merge/",
    info: { en: androidInfo(false, true), vi: androidInfo(true, true) },
  },
  {
    slug: "nah-blocks", name: "Nah Blocks", accent: "#3DDC97", label: "#3DDC97", onAccent: "#111111", platform: "android",
    status: { en: "Android · on Google Play", vi: "Android · đã có trên Google Play" },
    genre: { en: "Block puzzle", vi: "Puzzle xếp khối" },
    tagline: { en: "Line 'em up. They say nah.", vi: "Xếp hàng đi. Chúng bảo nah." },
    short: { en: "Drag blocks onto the board and fill a line to clear it. The blocks have opinions about it.",
             vi: "Kéo khối vào bàn, lấp đầy một hàng để xoá. Mấy khối này có ý kiến riêng đấy." },
    about: {
      en: ["Drag blocks onto the board. Fill a row or a column and it clears.",
           "Three blocks come at a time, and you have to place them all. Think ahead, keep the board open, and beat your own best score."],
      vi: ["Kéo khối vào bàn. Lấp đầy một hàng hoặc một cột là xoá.",
           "Mỗi lượt có ba khối và phải đặt hết. Tính trước, giữ bàn thoáng, và phá kỷ lục của chính mình."],
    },
    features: {
      en: [["Drag and clear", "Fill a row or a column and it clears."], ["Board blasts", "Clear the whole board for a blast and a bonus tray."], ["A rescue when stuck", "Out of room? A rescue gives you one more go."]],
      vi: [["Kéo và xoá", "Lấp đầy hàng hoặc cột là xoá."], ["Nổ cả bàn", "Xoá sạch bàn để nổ to và nhận khay thưởng."], ["Cứu khi kẹt", "Hết chỗ? Được cứu thêm một lượt."]],
    },
    icon: "/img/games/nah-blocks/icon.png", keyArt: "/img/games/nah-blocks/feature.jpg", media: playShots("nah-blocks"),
    trailer: "MzKyiu0qgWU", playPackage: "com.billthedev.nahblocks", storeLive: true, privacy: "/privacy/nah-blocks/",
    info: { en: androidInfo(false, true), vi: androidInfo(true, true) },
  },
  {
    slug: "bruh-arrows", name: "Bruh Arrows", accent: "#FF5A5F", label: "#FF7A7E", onAccent: "#FFFFFF", platform: "android",
    status: { en: "Android · on Google Play", vi: "Android · đã có trên Google Play" },
    genre: { en: "Path puzzle", vi: "Puzzle đường đi" },
    tagline: { en: "Tap. Yeet. Bruh.", vi: "Chạm. Bay. Bruh." },
    short: { en: "Tap an arrow and it flies off the board, if its path is clear. Find the right order and clear them all.",
             vi: "Chạm mũi tên là nó bay khỏi bàn, nếu đường trống. Tìm đúng thứ tự để dọn sạch." },
    about: {
      en: ["Tap an arrow and it flies off the board, if nothing is in its way.",
           "Arrows block each other, so the order matters. Find the right one and clear the board in as few taps as you can."],
      vi: ["Chạm một mũi tên là nó bay khỏi bàn, nếu không có gì cản.",
           "Các mũi tên chắn nhau nên thứ tự rất quan trọng. Tìm đúng thứ tự và dọn bàn với ít lần chạm nhất."],
    },
    features: {
      en: [["Order matters", "An arrow only flies if its path is clear."], ["Levels that grow", "Small boards first, then bigger and bigger tangles."], ["Arrow skins", "Unlock new arrow styles with the coins you earn."]],
      vi: [["Thứ tự là tất cả", "Mũi tên chỉ bay khi đường trống."], ["Màn chơi lớn dần", "Bàn nhỏ trước, rồi rối dần lên."], ["Skin mũi tên", "Mở kiểu mũi tên mới bằng xu kiếm được."]],
    },
    icon: "/img/games/bruh-arrows/icon.png", keyArt: "/img/games/bruh-arrows/feature.jpg", media: playShots("bruh-arrows"),
    trailer: "hPeMVKr5c7E", playPackage: "com.billthedev.bruharrows", storeLive: true, privacy: "/privacy/bruh-arrows/",
    info: { en: androidInfo(false, true), vi: androidInfo(true, true) },
  },
  {
    slug: "duck-drip", name: "Duck Drip", soon: true, accent: "#FFC531", label: "#FFD25E", onAccent: "#111111", platform: "android",
    status: { en: "Android · Coming soon to Google Play", vi: "Android · sắp ra mắt trên Google Play" },
    genre: { en: "Water ripple puzzle", vi: "Puzzle gợn nước" },
    tagline: { en: "Every drop counts.", vi: "Giọt nào cũng đáng giá." },
    short: { en: "Yippy the rubber duck can't swim. Tap to drop water, ride the ripples and bring her three ducklings home past soap, mud, hair dryers and whirlpools.",
             vi: "Vịt cao su Yippy không biết bơi. Chạm để nhỏ nước, cưỡi sóng gợn và đưa ba vịt con về nhà, vượt qua xà phòng, bùn, máy sấy và xoáy nước." },
    about: {
      en: ["Yippy is a rubber duck who can't swim, and one big splash has scattered her three ducklings across the tub.",
           "Tap to drop a drip of water. Its ripples push her along: aim them past soap bars, mud, hair dryers and whirlpools, pick up the babies and float home to the swim ring. Do it within par and the crown is yours."],
      vi: ["Yippy là một chú vịt cao su không biết bơi, và một cú té nước đã làm ba vịt con trôi tứ tán khắp bồn.",
           "Chạm để nhỏ một giọt nước. Sóng gợn sẽ đẩy Yippy đi: canh cho sóng đưa cô vượt xà phòng, bùn, máy sấy và xoáy nước, đón các con rồi về tới phao. Về trong số giọt par là được vương miện."],
    },
    features: {
      en: [["Real ripples", "Every drop sends out ripples. Where it lands decides where she floats."], ["200 levels, 10 worlds", "From the bathtub to the beach: soap, mud, hair dryers, whirlpools, tide pools."], ["Par crowns", "Bring all three babies home in par drops to win the crown."]],
      vi: [["Sóng gợn thật", "Mỗi giọt nước tạo sóng gợn. Rơi chỗ nào quyết định vịt trôi về đâu."], ["200 màn, 10 thế giới", "Từ bồn tắm ra bãi biển: xà phòng, bùn, máy sấy, xoáy nước, vũng thuỷ triều."], ["Vương miện par", "Đưa đủ ba vịt con về trong số giọt par để nhận vương miện."]],
    },
    icon: "/img/games/duck-drip/icon.png", keyArt: "/img/games/duck-drip/feature.jpg", media: ["cover", "shot1", "shot2", "shot3"].map((n) => `/img/games/duck-drip/${n}.jpg`),
    trailerFile: "/video/duck-drip-trailer.mp4", playPackage: "com.billthedev.dripduck", privacy: "/privacy/duck-drip/",
    info: {
      en: [["Platform", "Android, on Google Play"], ["Price", "Free · contains ads · in-app purchases"], ["Players", "1"], ["Levels", "200 in 10 worlds"], ["Status", "Coming soon"], ["Developer", "Bill The Dev"]],
      vi: [["Nền tảng", "Android, trên Google Play"], ["Giá", "Miễn phí · có quảng cáo · mua trong ứng dụng"], ["Người chơi", "1"], ["Số màn", "200 màn, 10 thế giới"], ["Trạng thái", "Sắp ra mắt"], ["Nhà phát triển", "Bill The Dev"]],
    },
  },
  {
    slug: "slam-cards", name: "Flip Flop Slam", accent: "#C2325F", label: "#F27AA0", onAccent: "#FFFFFF", platform: "web",
    status: { en: "Web · 2–4 players · Beta", vi: "Web · 2–4 người · Beta" },
    genre: { en: "Party game for 2–4", vi: "Game nhóm 2–4 người" },
    tagline: { en: "Slap the flip-flop. Flip the card.", vi: "Dép Lào Tuổi Thơ: đập dép, lật bài." },
    short: { en: "The schoolyard card-slapping game from Vietnam, now online. Slam your flip-flop on the table, let the gust flip your card, and land it face up on a friend's. Send a link and play in the browser.",
             vi: "Trò đập hình sân trường, giờ chơi online. Đập dép xuống bàn, gió lật bài của bạn, cho nó đáp ngửa đè lên bài úp của bạn bè là ăn hình. Gửi link là chơi trên trình duyệt." },
    about: {
      en: ["The card-slapping game Vietnamese kids played at recess, now online. In Vietnam it is called Dép Lào Tuổi Thơ: the flip-flops of our childhood.",
           "Slam your flip-flop near your card: the closer the hit, the harder the gust. Push your card toward a friend's, then land it face up on theirs while it lies face down, and the card is yours. Last player standing wins the round."],
      vi: ["Trò đập hình giờ ra chơi của bao thế hệ học sinh Việt Nam, giờ chơi online với bạn bè.",
           "Đập dép gần lá bài của mình: đập càng sát thì gió càng mạnh. Đẩy bài lại gần bài bạn, rồi cho nó đáp ngửa đè lên bài bạn đang úp là ăn hình. Ai trụ lại cuối cùng thì thắng ván."],
    },
    features: {
      en: [["Slam the flip-flop", "No power bar: the closer you hit, the harder the gust. Face up on face down wins the card."], ["2 to 4 players", "Make a room, send the link, friends join from their browser. Public rooms too."], ["Your slipper, your pet", "Pick a flip-flop, paint it, and choose one of 24 pets to seal in your card."]],
      vi: [["Đập dép", "Không có thanh lực: đập càng sát gió càng mạnh. Ngửa đè úp là ăn hình."], ["2 đến 4 người", "Tạo phòng, gửi link, bạn bè vào từ trình duyệt. Có cả phòng công khai."], ["Dép của bạn, pet của bạn", "Chọn dép, tô màu, và chọn 1 trong 24 pet nhốt vào lá bài."]],
    },
    icon: "/img/games/flip-flop-slam/icon.jpg", keyArt: "/img/games/flip-flop-slam/feature.jpg", keyArtPos: "left",
    media: [1, 2, 3].map((n) => `/img/games/flip-flop-slam/shot${n}.jpg`),
    trailerFile: "/video/flip-flop-slam-trailer.mp4",
    playUrl: "https://play.billthedevstudio.com/slam-cards/",
    info: {
      en: [["Platform", "Web browser, phone or computer"], ["Price", "Free"], ["Players", "2–4, online"], ["Also called", "Dép Lào Tuổi Thơ (Vietnam)"], ["Status", "Beta"], ["Developer", "Bill The Dev"]],
      vi: [["Nền tảng", "Trình duyệt web, điện thoại hoặc máy tính"], ["Giá", "Miễn phí"], ["Người chơi", "2–4, online"], ["Tên tiếng Việt", "Dép Lào Tuổi Thơ"], ["Trạng thái", "Beta"], ["Nhà phát triển", "Bill The Dev"]],
    },
  },
];

export const gameBySlug = (slug: string) => GAMES.find((g) => g.slug === slug);
