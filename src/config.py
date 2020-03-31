import os
import json
from collections import namedtuple
from jsonschema import validate
from jsonschema.exceptions import ValidationError


def load_config(path=os.getenv("CONFIG") or "config.json"):
    with open(path, "r") as f:
        c = json.load(
            f, object_hook=lambda d: namedtuple("config", d.keys())(*d.values())
        )
    return c
