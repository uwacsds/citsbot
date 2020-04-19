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
    def __init__(self, week_start):
        self.url = "https://secure.csse.uwa.edu.au/run/cssubmit"
        self.units = []
        self.deadlines = []
        self.week_start = week_start

    async def fetch_data(self) -> None:
        await self.__init_units()
        await self.__get_assessments()

    async def __init_units(self) -> None:
        """
        Initialise a list of units with a link pointing to their assessments
        """
        soup = await fetch_soup(self.url)
        for i, j in zip(soup.find_all("td", class_="thin")[1:], soup.find_all("td", class_="thing")):
            unit = {}
            unit["title"] = i.text.strip()
            link = j.find("a", href=True)
            if link is not None:
                unit["link"] = link["href"]

            self.units.append(unit)

    async def __get_assessments(self) -> None:
        """
        Fetch assessments and their due dates for each respective unit
        """
        for unit in self.units:
            soup = await fetch_soup(unit["link"])

            assignments = []
            for i, j in zip(
                self.__get_assessment_titles(soup), soup.find_all("td", class_="thin", string=re.compile("due"))
            ):
                assignment = {}
                assignment["title"] = i
                assignment["due_date"] = parser.parse(j.text[3:].strip())
                assignments.append(assignment)
            unit["assignments"] = assignments

    def __get_assessment_titles(self, soup):
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

    def fetch_deadlines(self) -> list:
        """
        Fetch all the assignments that are due this week
        """
        for unit in self.units:
            for assignment in unit["assignments"]:
                is_due = self.__is_due_this_week(
                    self.week_start, self.week_start + timedelta(days=7), assignment["due_date"]
                )
                if is_due:
                    self.deadlines.append(
                        {"title": unit["title"], "content": f'{assignment["title"]} due: {assignment["due_date"]}'}
                    )

        return self.deadlines
