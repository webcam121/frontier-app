export interface TokenUpdateRequest {
  id: string;
  title: string;
  description: string;
  image_url: string;
}

export interface TokenRegisterRequest {
  title: string;
  description: string;
  image_url: string;
}

export interface TokenDeleteRequest {
  id: string;
}

export interface TokenResponse {
  id: string;
  title: string;
  description: string;
  image_url: string;
  createdAt: string;
  updatedAt: string;
}