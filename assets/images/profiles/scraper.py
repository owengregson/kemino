import asyncio
import aiohttp
import os

# Directory to save the images
save_dir = 'downloaded_photos'
os.makedirs(save_dir, exist_ok=True)

# List of URLs to download with prefixes
urls = [(f"https://randomuser.me/api/portraits/women/{i}.jpg", f"w_{i}.jpg") for i in range(1, 91)] + \
       [(f"https://randomuser.me/api/portraits/men/{i}.jpg", f"m_{i}.jpg") for i in range(1, 91)]

async def download_image(session, url, filename):
    try:
        async with session.get(url) as response:
            if response.status == 200:
                content = await response.read()
                filepath = os.path.join(save_dir, filename)
                with open(filepath, 'wb') as file:
                    file.write(content)
                print(f"Downloaded {url} as {filename}")
            else:
                print(f"Failed to download {url}: Status {response.status}")
    except Exception as e:
        print(f"Error downloading {url}: {e}")

async def main():
    async with aiohttp.ClientSession() as session:
        tasks = [download_image(session, url, filename) for url, filename in urls]
        await asyncio.gather(*tasks)

# Run the event loop
if __name__ == "__main__":
    asyncio.run(main())
