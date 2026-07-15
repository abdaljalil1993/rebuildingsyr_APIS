export enum UserRole {
  USER = "USER",
  REVIEWER = "REVIEWER",
  ADMIN = "ADMIN"
}

export enum RequestStatus {
  PENDING = "PENDING",
  UNDER_REVIEW = "UNDER_REVIEW",
  NEEDS_INFO = "NEEDS_INFO",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED"
}

export enum ServiceFieldType {
  TEXT = "text",
  NUMBER = "number",
  FILE = "file",
  DATE = "date"
}

export enum MediaType {
  IMAGE = "image",
  PDF = "pdf"
}

export enum HelpOfferStatus {
  NEW = "NEW",
  CONTACTED = "CONTACTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  REJECTED = "REJECTED",
  CANCELED = "CANCELED"
}
