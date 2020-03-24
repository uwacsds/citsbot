import os
import json


def load_config(path=os.getenv('CONFIG') or 'config.json'):
    with open(path, 'r') as f:
        c = json.load(f)
    return c
