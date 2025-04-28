import os
from wand.image import Image

files = os.listdir(os.path.join(os.path.dirname(__file__), 'tabbar'))

for file in files:
    with Image(filename=file, resolution=300) as img:
        img.format = 'png'
        img.save(filename=file.replace('.svg', '.png'))
