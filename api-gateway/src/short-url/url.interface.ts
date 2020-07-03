export interface CreateURLRecordDto {
  url: string,
}

export interface GetURLRecordDto {
  url_hash: string,
}

export interface ShortenedURLDao {
  url: string,
  urlHash: string ,
  shortUrl: string ,
}

