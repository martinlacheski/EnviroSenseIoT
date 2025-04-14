from typing import TypeVar, Generic, List
from datetime import datetime, timedelta
from pydantic import BaseModel

T = TypeVar('T')

class PaginatedResponse(BaseModel, Generic[T]):
    data: List[T]
    pagination: dict

AGGREGATION_OPTIONS = {
    "1m": ("minute", 1),
    "5m": ("minute", 5),
    "15m": ("minute", 15),
    "30m": ("minute", 30),
    "1h": ("hour", 1),
    "2h": ("hour", 2),
}

DEFAULT_AGGREGATION = ("minute", 5)

def determine_aggregation(start_date: datetime, end_date: datetime):
    delta = end_date - start_date
    if delta <= timedelta(days=1):
        return AGGREGATION_OPTIONS["5m"]
    elif delta <= timedelta(days=7):
        return AGGREGATION_OPTIONS["30m"]
    elif delta <= timedelta(days=14):
        return AGGREGATION_OPTIONS["1h"]
    elif delta <= timedelta(days=31):
        return AGGREGATION_OPTIONS["2h"]
    else:
        return ("day", 1)