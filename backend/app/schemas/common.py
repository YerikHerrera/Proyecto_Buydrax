"""Schemas comunes de respuesta."""

from typing import Any, Generic, Optional, TypeVar

from pydantic import BaseModel, ConfigDict

T = TypeVar("T")


class MessageResponse(BaseModel):
    message: str


class ErrorDetail(BaseModel):
    code: str
    message: str
    details: Optional[Any] = None


class PaginatedMeta(BaseModel):
    total: int
    skip: int
    limit: int


class PaginatedResponse(BaseModel, Generic[T]):
    items: list[T]
    meta: PaginatedMeta


class ORMModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)
