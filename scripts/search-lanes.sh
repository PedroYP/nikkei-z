#!/bin/bash
# Búsqueda por carriles (2 en paralelo), reanudable, con reintentos
cd /home/z/my-project/scripts/img-results

search() {
  local key="$1"; local query="$2"
  if [ -s "${key}.json" ]; then echo "SKIP $key"; return 0; fi
  for attempt in 1 2 3 4; do
    echo ">>> [$key] attempt $attempt"
    if z-ai image-search -q "$query" -c 4 --gl us -o "${key}.json"; then
      echo "OK $key"; sleep 3; return 0
    fi
    echo "RETRY $key in 25s..."; sleep 25
  done
  echo "FAIL $key"
}

lane_a() {
  search philadelphia "Philadelphia sushi roll with salmon and cream cheese close up dark background"
  search furikake "crispy rice sushi with spicy salmon topping japanese"
  search nigiri "salmon nigiri sushi dark moody photography"
  search platter "assorted sushi platter on dark slate stone"
  search interior "elegant dark japanese restaurant interior wooden counter"
  search dorayaki "dorayaki japanese pancake dessert with cream"
  search chicha "chicha morada purple corn peruvian drink glass"
  search lima "Miraflores Lima Peru coastline malecon sunset"
}

lane_b() {
  search rainbow "rainbow sushi roll with colorful fish slices close up"
  search veggie "vegetable sushi roll with avocado mango close up"
  search acevichado "sushi roll with spicy red cream sauce drizzle close up"
  search chef "sushi chef hands rolling maki on bamboo mat"
  search matcha "japanese matcha dessert mochi dark"
  search chopsticks "chopsticks picking up salmon sushi roll dark moody"
  search maracuya "passion fruit maracuya juice glass fresh"
}

lane_a &
lane_b &
wait
echo "ALL_LANES_DONE"
