#!/bin/bash

foldersFile="./scripts/folders_shel_sync.txt"

# Read the list of folders from the file
mapfile -t folders < "$foldersFile"

# Iterate over each folder
for folder in "${folders[@]}"; do
    echo "Entering folder: $folder"
    cd "$folder"

    # Run the npm command in each folder
    npm update @qptickets/common --save
#    npm install

    echo
done

echo "All folders processed."
