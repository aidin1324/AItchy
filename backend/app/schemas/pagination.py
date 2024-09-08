from typing import List, TypeVar, Generic, Optional
from pydantic import BaseModel

T = TypeVar('T')

class PaginatedResponse(Generic[T], BaseModel):
    items: List[T]
    next_cursor: Optional[int] = None
