import os
import json
from collections import namedtuple


def load_config(path=os.getenv("CONFIG") or "config.json"):
    with open(path, "r") as f:
        c = json.load(f)
    return c
