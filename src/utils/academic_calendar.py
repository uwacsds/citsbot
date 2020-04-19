"""
Utility class for fetching UWA teaching dates
"""

import re
from typing import Tuple
from bs4 import BeautifulSoup
from dateutil.parser import parse as parse_date
import aiohttp
from utils.soup import fetch_soup


class AcademicCalendar:
    def __init__(self):
        self.url = "https://ipoint.uwa.edu.au/app/answers/detail/a_id/1405/~/2016-dates-and-teaching-weeks"
        self.teaching_dates = {}
        self.cur_sem = None

    async def fetch_data(self) -> None:
        self.soup = await fetch_soup(self.url)
        self.get_teaching_dates()

    def get_teaching_dates(self) -> dict:
        """
        Return a dictionary of undergraduate dates and teaching weeks
        """
        table = self.soup.find("table", border=1)
        rows = table.find_all("tr")

        week_commencing = []
        semester_week = []

        for row in rows[1:]:
            week_commencing.append(row.find_all("td")[1])
            semester_week.append(row.find_all("td")[2])

        for i, j in zip(week_commencing, semester_week):
            week_semester = {}
            if "/" in j.text.strip():
                sem_wk = [s for s in j.text.strip().split() if s.isdigit()]
                self.cur_sem = sem_wk[0]
                week_semester["semester"] = self.cur_sem
                week_semester["week"] = sem_wk[1]
            elif "Exam" or "Study Break" in j.text.strip():
                week_semester["semester"] = self.cur_sem
                week_semester["week"] = j.text.strip()

            self.teaching_dates[parse_date(i.text.strip()).date().isoformat()] = week_semester

        return self.teaching_dates

    def get_semester(self, date) -> Tuple[str, int]:
        """
        Return the current semester
        """
        try:
            return self.teaching_dates[date]["semester"]
        except:
            return ["error", -1]

    def get_week(self, date) -> Tuple[str, int]:
        """
        Return the current week of the semester
        """
        try:
            return self.teaching_dates[date]["week"]
        except:
            return ["error", -1]
