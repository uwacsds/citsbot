"""
Utility class for fetching assessment deadlines from cssubmit
"""

import re
import requests
import aiohttp
from dateutil import parser
from datetime import timedelta
from datetime import datetime
from utils.soup import fetch_soup


class Deadlines:
    def __init__(self):
        self.url = "https://secure.csse.uwa.edu.au/run/cssubmit"
        self.units = []
        self.deadlines = []

    async def fetch_data(self) -> None:
        await self.__fetch_units()
        await self.__fetch_assessments()

    async def __fetch_units(self) -> None:
        """
        Fetch unit data from cssubmit
        Creates a list of units with a link to their assesments page
        """
        soup = await fetch_soup(self.url)
        unit_titles = soup.find_all("td", class_="thin")[1:]
        unit_links = soup.find_all("td", class_="thing")
        for unit_title, unit_link in zip(unit_titles, unit_links):
            unit = {}
            unit["title"] = unit_title.text.strip()
            link = unit_link.find("a", href=True)
            if link is not None:
                unit["link"] = link["href"]
            self.units.append(unit)

    async def __fetch_assessments(self) -> None:
        """
        Fetch assesment data for each unit
        Creates a list of assesments and their due dates for each unit
        """
        for unit in self.units:
            soup = await fetch_soup(unit["link"])
            assignments = []
            assmnt_titles = self.__find_assessment_titles(soup)
            assmnt_dates = soup.find_all("td", class_="thin", string=re.compile("due"))
            for asmnt_title, asmnt_date in zip(assmnt_titles, assmnt_dates):
                assignment = {}
                assignment["title"] = asmnt_title
                assignment["due_date"] = parser.parse(asmnt_date.text[3:].strip())
                assignments.append(assignment)
            unit["assignments"] = assignments

    def __find_assessment_titles(self, soup):
        """
        Generator function to fetch and sanitise assessment titles
        """
        for td in soup.find_all("td", class_="thin"):
            if td.find(text=re.compile("|".join(["%", "test"]))):
                yield " ".join([text for text in td.stripped_strings])

    def __is_due_this_week(self, start, end, due_date) -> bool:
        """
        Check if a given assessment is due this week
        """
        return start <= due_date <= end

    def get_deadlines_this_week(self, date) -> list:
        """
        Gets the deadlines occuring in the week that date belongs to
        """
        for unit in self.units:
            for assignment in unit["assignments"]:
                if self.__is_due_this_week(date, date + timedelta(days=7), assignment["due_date"]):
                    self.deadlines.append(
                        {"title": unit["title"], "content": f'{assignment["title"]} due: {assignment["due_date"]}'}
                    )

        return self.deadlines
