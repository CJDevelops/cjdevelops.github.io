# -*- coding: UTF-8 -*-
import xml.etree.ElementTree as ET
import os
import re
from PIL import Image

# GLOBALS
HTML_TOP = """
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Movie Viewer</title>
        <link rel="stylesheet" href="css/custom.css" />
        <link rel="apple-touch-icon" sizes="76x76" href="/favicon/apple-touch-icon.png">
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png">
        <link rel="manifest" href="/favicon/site.webmanifest">
        <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#5bbad5">
        <link rel="shortcut icon" href="/favicon/favicon.ico">
        <meta name="msapplication-TileColor" content="#da532c">
        <meta name="msapplication-config" content="/favicon/browserconfig.xml">
        <meta name="theme-color" content="#ffffff">
    </head>
    <body>
        <main class="container-fluid">
            <div class="main">
"""
HTML_BOTTOM = """
            </div>
		</main>
	</body>
    <script src="script.js"></script>
</html>
"""
SOURCE_DIR = r'H:\Media\Films'
IMAGE_DIR = r'H:\Development\movie-viewer\images'
IMAGE_SIZE = (300, 450)

def write_to_HTML(file_to_write, string_to_write, method="a"):
    with open(file_to_write, method) as HTML_FILE:
        HTML_FILE.write(string_to_write)

def process_data_from_nfo(data, override=False):
    def format_time(minutes):
        return f"{minutes // 60}h {minutes % 60}m"
    
    new_filename = f"{data['title']} ({data['year']})"
    new_runtime = format_time(int(data["runtime"]))
    file_string_main = f"""
    <div>
		<a href="pages/{new_filename}.html"><img src="/images/{new_filename}.jpg" width="200px" alt="" /></a>
		<p>{data["title"]}</p>
        <p class="movie-year">{data["year"]} | {new_runtime}</p>
	</div>
    """  
    write_to_HTML("index.html", file_string_main)

    file_string_each = f"""
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>{new_filename}</title>
            <link rel="stylesheet" href="../css/custom.css" />
            <link rel="apple-touch-icon" sizes="76x76" href="/favicon/apple-touch-icon.png">
            <link rel="icon" type="image/png" sizes="32x32" href="../favicon/favicon-32x32.png">
            <link rel="icon" type="image/png" sizes="16x16" href="../favicon/favicon-16x16.png">
            <link rel="manifest" href="../favicon/site.webmanifest">
            <link rel="mask-icon" href="../favicon/safari-pinned-tab.svg" color="#5bbad5">
            <link rel="shortcut icon" href="../favicon/favicon.ico">
            <meta name="msapplication-TileColor" content="#da532c">
            <meta name="msapplication-config" content="../favicon/browserconfig.xml">
            <meta name="theme-color" content="#ffffff">
        </head>
        <body>
            <div class="filmPage">
                <div><img src="../images/{new_filename}.jpg" width="300px" alt="" /></div>
                <div>
                    <h1>{data["title"]}</h1>
                    <h2 class="filmHeading">
                        <span class="filmYear">{data["year"]}</span>
                        <span class="filmDuration">{new_runtime}</span>
                        <span class="filmMPAA">{data["mpaa"]}</span>
                        <span class="filmRating"><span class="imdb">IMDb</span> {data["rating"]}</span>
                        <span class="filmRating"><span class="tomato">T</span> {data["criticrating"]}%</span>
                    </h2>
                    <p class="plot">{data["plot"]}</p>
                    <p><span class="filmDetailHead">Director:</span> {data["director"]}</p>
                    <p><span class="filmDetailHead">Staring:</span> {data["actors"]}</p>
                    <p><span class="filmDetailHead">Genre:</span> {data["genres"]}</p>
                </div>
            </div>
            <div class="returnLink">
                <a href="../index.html">Back to Film List</a>
            </div>
        </body>
    </html>"""
    if not os.path.isfile(f"pages/{new_filename}.html") or override:
        write_to_HTML(f"pages/{new_filename}.html", file_string_each, "w")
        print(f"Successfully processed page for {new_filename}")
    else:
        print(f"Skipped making page for {new_filename} as it already exists")

def extract_data_from_nfo(nfo_file):
    root_data = ET.parse(nfo_file).getroot()

    data_from_nfo = {
        "plot": root_data.findtext("plot", "-"),
        "title": root_data.findtext("title", "-"),
        "year": root_data.findtext("year", "-"),
        "runtime": root_data.findtext("runtime", "-"),
        "director": root_data.findtext("director", "-"),
        "rating": root_data.findtext("rating", "-")[:3],
        "criticrating": root_data.findtext("criticrating", "-"),
        "tagline": root_data.findtext("tagline", "-"),
        "mpaa": root_data.findtext("mpaa", "-"),
        "actors": ", ".join(actor.findtext("name") for actor in root_data.findall("actor")[:4]) or "-",
        "genres": ", ".join(genre.text for genre in root_data.findall("genre")) or "-",
    }

    return data_from_nfo

def main(override=False):
    film_data = []
    for dirpath, dirnames, filenames in os.walk(SOURCE_DIR):
        for filename in filenames:
            if filename.endswith(".nfo"):
                nfo_path = os.path.join(dirpath, filename)
                try:
                    data_from_nfo = extract_data_from_nfo(nfo_path)
                    data_from_nfo["title"] = re.sub(r'[^\w\s]', '', data_from_nfo["title"]).strip()
                    film_data.append(data_from_nfo)
                    image_path = os.path.join(dirpath, "folder.jpg")
                    if os.path.isfile(image_path):
                        new_filename = f"{data_from_nfo['title']} ({data_from_nfo['year']}).jpg"
                        new_filepath = os.path.join(IMAGE_DIR, new_filename)
                        if not os.path.isfile(new_filepath) or override:
                            image = Image.open(image_path)
                            image.thumbnail(IMAGE_SIZE)
                            image.save(new_filepath)
                            print(f"Successfully processed image for {filename}")
                        else:
                            print(f"Skipping image for {filename} as file already exists")
                    else:
                        print(f"No image found for {filename}")
                except Exception as e:
                    print(f"Error processing {filename}: {e}")

    count = 0  # counter for number of processed items
    film_data_sorted = sorted(film_data, key=lambda k: (k['year'], k['title']))
    for film in film_data_sorted:
        process_data_from_nfo(film, override=override)
        count += 1
        if count % 6 == 0:
            write_to_HTML("index.html", """</div><div class="main">""")

if __name__ == "__main__":
    write_to_HTML("index.html", HTML_TOP, "w")
    main(override=False)
    write_to_HTML("index.html", HTML_BOTTOM)