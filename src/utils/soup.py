import aiohttp
from bs4 import BeautifulSoup


async def fetch_soup(url: str) -> BeautifulSoup:
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as resp:
            page = await resp.read()
            return BeautifulSoup(page, "html.parser")
