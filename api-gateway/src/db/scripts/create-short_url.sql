CREATE TABLE short_url (
    url_id SERIAL PRIMARY KEY,
    url text,
    url_hash character varying(100),
    shortened_url text,
    is_active boolean DEFAULT true
);

CREATE UNIQUE INDEX short_url_pkey ON short_url(url_id int4_ops);
