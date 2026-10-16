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
  /** Screens in the media rail; `wide` ones are landscape. */
  media: string[];
  wide?: boolean;
  trailer?: string;
  playPackage?: string;
  /** true once the Google Play page is public; until then the badge offers the test by email. */
  storeLive?: boolean;
  playUrl?: string;
  privacy?: string;
  info: Record<Locale, [string, string][]>;
};

const androidInfo = (vi: boolean): [string, string][] =>
  vi
    ? [["Nền tảng", "Android, trên Google Play"], ["Giá", "Miễn phí · có quảng cáo · mua trong ứng dụng"], ["Người chơi", "1"],
       ["Ngôn ngữ", "English, Tiếng Việt"], ["Trạng thái", "Đang thử nghiệm trên Google Play"], ["Nhà phát triển", "Bill The Dev"]]
    : [["Platform", "Android, on Google Play"], ["Price", "Free · contains ads · in-app purchases"], ["Players", "1"],
       ["Languages", "English, Tiếng Việt"], ["Status", "Testing on Google Play"], ["Developer", "Bill The Dev"]];

const shots = (slug: string) => [1, 2, 3].map((n) => `/img/games/${slug}/shot${n}.jpg`).concat(`/img/games/${slug}/cover.jpg`);

export const GAMES: Game[] = [
  {
    slug: "meh-merge", name: "Meh Merge", accent: "#B7A6FF", label: "#B7A6FF", onAccent: "#111111", platform: "android",
    status: { en: "Android · Google Play testing", vi: "Android · đang thử nghiệm trên Google Play" },
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
    icon: "/img/games/meh-merge/icon.png", keyArt: "/img/games/meh-merge/feature.jpg", media: shots("meh-merge"),
    trailer: "U5scIFVhbkg", playPackage: "com.billthedev.mehmerge", privacy: "/privacy/meh-merge/",
    info: { en: androidInfo(false), vi: androidInfo(true) },
  },
  {
    slug: "nah-blocks", name: "Nah Blocks", accent: "#3DDC97", label: "#3DDC97", onAccent: "#111111", platform: "android",
    status: { en: "Android · Google Play testing", vi: "Android · đang thử nghiệm trên Google Play" },
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
    icon: "/img/games/nah-blocks/icon.png", keyArt: "/img/games/nah-blocks/feature.jpg", media: shots("nah-blocks"),
    trailer: "iilWXRwL5cQ", playPackage: "com.billthedev.nahblocks", privacy: "/privacy/nah-blocks/",
    info: { en: androidInfo(false), vi: androidInfo(true) },
  },
  {
    slug: "bruh-arrows", name: "Bruh Arrows", accent: "#FF5A5F", label: "#FF7A7E", onAccent: "#FFFFFF", platform: "android",
    status: { en: "Android · Google Play testing", vi: "Android · đang thử nghiệm trên Google Play" },
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
    icon: "/img/games/bruh-arrows/icon.png", keyArt: "/img/games/bruh-arrows/feature.jpg", media: shots("bruh-arrows"),
    trailer: "BLJmR8OaI2I", playPackage: "com.billthedev.bruharrows", privacy: "/privacy/bruh-arrows/",
    info: { en: androidInfo(false), vi: androidInfo(true) },
  },
  {
    slug: "slam-cards", name: "Slam Cards", accent: "#D63C6E", label: "#F27AA0", onAccent: "#FFFFFF", platform: "web",
    status: { en: "Web · 2–4 players · Beta", vi: "Web · 2–4 người · Beta" },
    genre: { en: "Party game for 2–4", vi: "Game nhóm 2–4 người" },
    tagline: { en: "Slap the table. Flip the card.", vi: "Đập bàn. Lật bài." },
    short: { en: "A schoolyard game from Vietnam, now online. Slap the table so the gust flips your card onto your friend's. Send a link and play in the browser.",
             vi: "Trò chơi tuổi thơ Việt Nam, giờ chơi online. Đập bàn cho gió lật bài của bạn đè lên bài bạn bè. Gửi link là chơi trên trình duyệt." },
    about: {
      en: ["A schoolyard game from Vietnam, now online. Everyone puts a card on the table and takes turns slapping it.",
           "The gust of your slap flips your card. Land it on a friend's card and it's yours. Make a room, send the link, and play in the browser."],
      vi: ["Trò chơi sân trường Việt Nam, giờ chơi online. Mỗi người đặt một lá bài lên bàn và lần lượt đập bàn.",
           "Gió từ cú đập lật bài của bạn. Đè lên bài bạn bè là bài đó thuộc về bạn. Tạo phòng, gửi link, chơi ngay trên trình duyệt."],
    },
    features: {
      en: [["Slap the table", "Your slap's gust flips the card. Land it on a friend's card to win it."], ["2 to 4 players", "Make a room and send the link. Friends join from their browser."], ["No download", "Plays in the browser on phones and computers."]],
      vi: [["Đập bàn", "Gió từ cú đập lật bài. Đè lên bài bạn bè là thắng lá đó."], ["2 đến 4 người", "Tạo phòng, gửi link. Bạn bè vào từ trình duyệt."], ["Không cần tải", "Chơi trên trình duyệt, cả điện thoại lẫn máy tính."]],
    },
    icon: "/img/games/slam-cards/icon.jpg", keyArt: "/img/games/slam-cards/slippers.jpg",
    media: ["/img/games/slam-cards/table.jpg", "/img/games/slam-cards/slippers.jpg"], wide: true,
    playUrl: "https://billthedevstudio.io.vn/slam-cards/",
    info: {
      en: [["Platform", "Web browser, phone or computer"], ["Price", "Free"], ["Players", "2–4, online"], ["Status", "Beta"], ["Developer", "Bill The Dev"]],
      vi: [["Nền tảng", "Trình duyệt web, điện thoại hoặc máy tính"], ["Giá", "Miễn phí"], ["Người chơi", "2–4, online"], ["Trạng thái", "Beta"], ["Nhà phát triển", "Bill The Dev"]],
    },
  },
];

export const gameBySlug = (slug: string) => GAMES.find((g) => g.slug === slug);
