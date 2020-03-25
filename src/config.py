import os
import json
from collections import namedtuple


def load_config(path=os.getenv('CONFIG') or 'config.json'):
    with open(path, 'r') as f:
        c = json.load(f, object_hook=lambda d: namedtuple('config', d.keys())(*d.values()))
    return c
