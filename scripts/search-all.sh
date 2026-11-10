#!/bin/bash
# Sequential image search with retry/backoff (avoids 429)
cd /home/z/my-project/scripts/img-results

search() {
  local key="$1"; local query="$2"
  if [ -s "${key}.json" ]; then echo "SKIP $key (exists)"; return 0; fi
  for attempt in 1 2 3 4; do
    echo ">>> [$key] attempt $attempt"
    z-ai image-search -q "$query" -c 4 --gl us -o "${key}.json" && { echo "OK $key"; sleep 4; return 0; }
    echo "RETRY $key in 20s..."; sleep 20
  done
  echo "FAIL $key"
}

search philadelphia "Philadelphia sushi roll with salmon and cream cheese close up dark background"
search rainbow "rainbow sushi roll with colorful fish slices close up"
search furikake "crispy rice sushi with spicy salmon topping japanese"
search veggie "vegetable sushi roll with avocado mango close up"
search nigiri "salmon nigiri sushi dark moody photography"
search acevichado "sushi roll with spicy red cream sauce drizzle close up"
search platter "assorted sushi platter on dark slate stone"
search chef "sushi chef hands rolling maki on bamboo mat"
search interior "elegant dark japanese restaurant interior wooden counter"
search salmon "fresh raw salmon fillet slices dark background"
search dessert "japanese matcha dessert mochi dark"
search chopsticks "chopsticks picking up salmon sushi roll dark moody"
search chicha "chicha morada purple corn peruvian drink glass"
search maracuya "passion fruit maracuya juice glass fresh"
search lima "Miraflores Lima Peru coastline malecon sunset"
echo "ALL_SEARCHES_DONE"
