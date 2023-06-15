import { doGet, doPost, doPut, doDelete } from './http';

import { TokenDeleteRequest, TokenRegisterRequest, TokenResponse, TokenUpdateRequest } from '../types/token';

export const TokenService = {
  createToken: (dto: TokenRegisterRequest): Promise<TokenResponse> => {
    return doPost('/token', { ...dto });
  },
  getTokens: (): Promise<TokenResponse[]> => {
    return doGet('/token');
  },
  getToken: (tokenId: string): Promise<TokenResponse> => {
    return doGet(`/token/${tokenId}`);
  },
  deleteToken: (dto: TokenDeleteRequest): Promise<TokenResponse> => {
    return doDelete('/token', { ...dto });
  },
  updateToken: (dto: TokenUpdateRequest): Promise<TokenResponse> => {
    return doPut('/token', { ...dto });
  },
};