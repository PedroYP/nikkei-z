#!/bin/bash
# Batch 1: product images
cd /home/z/my-project/scripts/img-results

z-ai image-search -q "Philadelphia sushi roll with salmon and cream cheese close up dark background" -c 4 --gl us -o philadelphia.json &
z-ai image-search -q "California sushi roll with tobiko roe close up dark plate" -c 4 --gl us -o california.json &
z-ai image-search -q "dragon roll sushi with avocado and eel unagi glaze dark plate" -c 4 --gl us -o dragon.json &
z-ai image-search -q "rainbow sushi roll with colorful fish slices close up" -c 4 --gl us -o rainbow.json &
z-ai image-search -q "crunchy tempura fried sushi roll close up dark" -c 4 --gl us -o tempura.json &
z-ai image-search -q "crispy rice sushi with spicy salmon topping japanese" -c 4 --gl us -o furikake.json &
wait
echo "BATCH1 DONE"
