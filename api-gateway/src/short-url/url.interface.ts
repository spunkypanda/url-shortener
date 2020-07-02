export interface CreateURLRecordDTO {
  url: string,
}

export interface GetURLRecordDTO {
  url_hash: string,
}

export interface ShortenedURLDAO {
  url: string,
  urlHash: string ,
  shortUrl: string ,
}

