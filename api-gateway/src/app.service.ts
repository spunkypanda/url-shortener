import { Injectable } from '@nestjs/common';
import { generate as generateShortID } from 'shortid';

import { ShortenedURLDao } from './short-url/url.interface';

const RETRY_COUNT = 3;
const whitelabelHost = "www.chinmay.com";

const getShortURL = (urlHash: string): string => {
  return `http://${whitelabelHost}/${urlHash}`;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const isDuplicateUrl = (urlHash: string ): boolean => {
  return false
}

const getURLHash = (retryCount: number, skipDuplicateCheck = false): string => {
  if (retryCount == 0) return null
  const urlHash = generateShortID()
  if (!skipDuplicateCheck && isDuplicateUrl(urlHash)) return getURLHash(retryCount-1) 
  return generateShortID()
};

@Injectable()
export class AppService {
  async getHello(): Promise<string> {
    return 'Pong!';
  }

  async createShortenedURLService(url: string): Promise<ShortenedURLDao> {
    const urlHash = getURLHash(3, true);

    if (urlHash === null) {
      return 
    }

    const shortenedURLDao = {
      url,
      "urlHash" : urlHash ,
      "shortUrl" : getShortURL(urlHash),
    };

    return shortenedURLDao;
  }

  async getShortenedURLService(urlHash: string): Promise<string> {
    return `Get shortened URL service! - ${urlHash}`;
  }

  async updateShortenedURLService(url: string): Promise<ShortenedURLDao> {
    const urlHash = getURLHash(RETRY_COUNT);
    const shortenedURLDao = {
      url,
      "urlHash" : urlHash ,
      "shortUrl" : getShortURL(urlHash),
    };

    return shortenedURLDao;
  }

  async deleteShortenedURLService(urlHash: string): Promise<string> {
    return `Deleted ${urlHash}`
  }
}
