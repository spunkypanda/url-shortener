export interface CreateURLRecordDTO {
  url: string,
}

export interface UpdateURLRecordDTO {
  url_hash: string,
}

export interface GetURLRecordDTO {
  url_hash: string,
}

export interface DeleteURLRecordDAO {
  message: string,
  url: string,
  shortened_url: string,
}

export interface UpdateURLRecordDAO {
  message: string,
  url: string,
  shortened_url: string,
}

export interface ShortenedURLDAO {
  url: string,
  urlHash: string ,
  shortUrl: string ,
}
