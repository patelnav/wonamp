import csv

def create_playlist_url(output_file: str) -> str:
    video_ids = []

    # Read the output CSV to extract video IDs
    try:
        with open(output_file, 'r', encoding='utf-8') as csvfile:
            reader = csv.reader(csvfile)
            next(reader)  # Skip header
            for row in reader:
                if row[1] != "No result found":
                    video_id = row[1].split('=')[-1]
                    video_ids.append(video_id)
    except Exception as e:
        print(f"Failed to read output file: {str(e)}")
        return ""

    # Construct the playlist URL
    if video_ids:
        playlist_url = f"https://www.youtube.com/watch_videos?video_ids={','.join(video_ids)}"
        return playlist_url
    else:
        return "No valid video IDs found."

# Example usage
if __name__ == "__main__":
    output_file = "output.csv"  # Replace with your actual output file path
    playlist_url = create_playlist_url(output_file)
    print(playlist_url)