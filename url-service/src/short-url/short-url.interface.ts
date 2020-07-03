export interface CreateURLRecordDto {
  url: string,
}

export interface UpdateURLRecordDto {
  url_hash: string,
}

export interface GetURLRecordDto {
  url_hash: string,
}

export interface DeleteURLRecordDao {
  message: string,
  url: string,
  shortened_url: string,
}

export interface UpdateURLRecordDao {
  message: string,
  url: string,
  url_hash: string,
  shortened_url: string,
}

export interface ShortenedURLDao {
  url: string,
  urlHash: string ,
  shortUrl: string ,
}
