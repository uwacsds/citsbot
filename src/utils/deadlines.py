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
        Creates a list of units with a link to their assessments page
        """
        soup = await fetch_soup(self.url)
        unit_titles = soup.find_all("td", class_="thin")[1:]
        unit_links = soup.find_all("td", class_="thing")
        for unit_title, unit_link in zip(unit_titles, unit_links):
            unit = {}
            unit["title"] = unit_title.text[:-3].strip()
            link = unit_link.find("a", href=True)
            if link is not None:
                unit["link"] = link["href"]
            self.units.append(unit)

    async def __fetch_assessments(self) -> None:
        """
        Fetch assessment data for each unit
        Creates a list of assessments and their due dates for each unit
        """
        for unit in self.units:
            soup = await fetch_soup(unit["link"])
            assignments = []
            table = soup.find("table", class_="thin")
            rows = table.find_all("tr")
            assessment_rows = []
            for row in rows[1:]:
                assessment_row = row.find_all("td")
                # Filter on rows that contain 3 cells. These are the rows that contain the assessment information
                if len(assessment_row) == 3:
                    assessment_rows.append(assessment_row)
            for rows in assessment_rows:
                assignment = {}
                assignment["title"] = rows[1].text[3:].strip()
                assignment["due_date"] = parser.parse(
                    " ".join(
                        [
                            x
                            for x in rows[2].text.strip().split()
                            if x not in {"was", "due", "at", "submissions", "closed"}
                        ]
                    )
                )
                assignments.append(assignment)
            print("Assignments for", unit["title"], assignments)
            unit["assignments"] = assignments

    def __is_due_this_week(self, start, end, due_date) -> bool:
        """
        Check if a given assessment is due this week
        """
        return start <= due_date <= end

    def get_deadlines_this_week(self, date, include_postgrad=False) -> list:
        """
        Gets the deadlines occurring in the week that date belongs to. Ignore postgrad units by default
        """
        monday = date - timedelta(days=date.weekday())
        for unit in self.units:
            # Skip over any postgrad units in the range CITS(456+)xxx unless otherwise specified
            if not include_postgrad and unit["title"][4] in [str(x) for x in range(4, 10)]:
                print("Ignoring postgrad unit:", unit["title"])
                continue
            for assignment in unit["assignments"]:
                print("Checking:", unit["title"],
                      "assignment:", assignment["title"])
                if self.__is_due_this_week(monday, monday + timedelta(days=7), assignment["due_date"]):
                    print("\tAssignment is in range")
                    self.deadlines.append(
                        {
                            "title": unit["title"],
                            "content": f'{assignment["title"]} due: {assignment["due_date"].strftime("%d-%m-%Y, %I:%M %p")}',
                        }
                    )

        return self.deadlines
