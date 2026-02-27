const CATEGORY_MAP = {
  tourism: "관광",
  "tourism.sights": "관광명소",
  "tourism.sights.castle": "궁궐",
  "tourism.attraction": "관광지",
  leisure: "여가",
  "leisure.park": "공원",
  fee: "입장료 있음",
  free: "무료",
  museum: "박물관",
  shopping: "쇼핑",
  restaurant: "음식점",
  cafe: "카페",
  building: "건물",
  "building.tourism": "관광 건물",
  "man_made.tower": "인공 구조물 · 탑",
  "tourism.sights.tower": "명소 · 탑",
  wheelchair: "휠체어",
  "wheelchair.yes": "휠체어 사용 가능",
  heritage: "유산",
  "heritage.unesco": "유네스코 세계유산",
  religion: "종교",
  "religion.place_of_worship": "예배 장소",
  "religion.place_of_worship.christianity": "기독교 예배 장소",
  "tourism.sights.place_of_worship": "명소 · 예배 장소",
  "building.commercial": "상업용 건물",
  commercial: "상업",
  "commercial.shopping_mall": "쇼핑몰",
  "commercial.marketplace": "시장",
};

// 문자열 하나 변환
export const translateCategory = (category) => {
  // 1️⃣ 먼저 CATEGORY_MAP에 통째로 있는지 확인 (예: "tourism.sights")
  if (CATEGORY_MAP[category]) {
    return CATEGORY_MAP[category];
  }

  // 2️⃣ 통째로 없을 때만 점(.)으로 나눠서 개별 번역 시도
  return category
    .split(".")
    .map((word) => CATEGORY_MAP[word] || word)
    .join(" · ");
};

// 배열 전체 변환
export const translateCategories = (categories = []) => {
  return categories.map(translateCategory);
};