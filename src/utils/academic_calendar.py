"""
Utility class for fetching UWA teaching dates
"""

import re
from typing import Tuple
from bs4 import BeautifulSoup
from dateutil.parser import parse as parse_date
import aiohttp
from utils.soup import fetch_soup
from datetime import timedelta


class AcademicCalendar:
    def __init__(self):
        self.url = "https://ipoint.uwa.edu.au/app/answers/detail/a_id/1405/~/2016-dates-and-teaching-weeks"
        self.teaching_dates = {}
        self.cur_sem = None

    async def fetch_data(self) -> None:
        soup = await fetch_soup(self.url)
        self.__parse_teaching_dates(soup)

    def __parse_teaching_dates(self, soup) -> None:
        """
        Parse teaching dates from UWA undergrad dates page
        """
        week_commencings = []
        semester_weeks = []

        table = soup.find("table", border=1)
        rows = table.find_all("tr")
        for row in rows[1:]:
            week_commencings.append(row.find_all("td")[1])
            semester_weeks.append(row.find_all("td")[2])

        for wk_comm, sem_wk in zip(week_commencings, semester_weeks):
            wk_comm = wk_comm.text.strip()
            sem_wk = sem_wk.text.strip()
            week_semester = {}
            if "/" in sem_wk:
                sem_wk = [s for s in sem_wk.split() if s.isdigit()]
                self.cur_sem = sem_wk[0]
                week_semester["semester"] = self.cur_sem
                week_semester["week"] = sem_wk[1]
            elif "Exam" or "Study Break" in sem_wk:
                week_semester["semester"] = self.cur_sem
                week_semester["week"] = sem_wk
            self.teaching_dates[parse_date(wk_comm).date().isoformat()] = week_semester

    def get_semester(self, date) -> str:
        """
        Get the semester the given date falls into
        """
        monday = date - timedelta(days=date.weekday())
        try:
            return self.teaching_dates[str(monday.date())]["semester"]
        except KeyError:
            return "UNKNOWN_SEMESTER"

    def get_week(self, date) -> str:
        """
        Get the semester week that given date falls into
        """
        monday = date - timedelta(days=date.weekday())
        try:
            return self.teaching_dates[str(monday.date())]["week"]
        except KeyError:
            return "UNKNOWN_WEEK"
