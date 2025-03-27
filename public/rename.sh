#!/usr/bin/env bash

# Loop over files matching the pattern "portrait*png.png"
# for file in portrait*png.png; do
#   # Use sed to remove the "portrait" prefix and the trailing "png" before .png
#   newName=$(echo "$file" | sed -E 's/^portrait(.*)png\.png$/\1.png/')
#   mv "$file" "$newName"
# done

# zzzzz-[digits]portrait{name}[optional extra "png"].png
# for file in zzzzz-*portrait*png; do
#   # Extract just the name part between "portrait" and ".png"
#   # For example, from "zzzzz-1734804059ollieportrait.png" extract "ollie"
#   name=$(echo "$file" | sed -E 's/^zzzzz-[0-9]+([a-zA-Z]+)portrait(.*)?\.png$/\1/')
  
#   # Create new filename with proper extension
#   newName="${name}.png"
  
#   # Rename the file
#   mv "$file" "$newName"
#   echo "Renamed $file -> $newName"
# done



mkdir -p brawlers

# Move all .png files into the brawlers folder
mv *.png brawlers/