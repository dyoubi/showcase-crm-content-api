CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- SCHEMA: service
-- DROP SCHEMA IF EXISTS service ;
CREATE SCHEMA IF NOT EXISTS service
    AUTHORIZATION ringcontent;

-- Table: service.stores
-- DROP TABLE service.stores;
CREATE TABLE IF NOT EXISTS service.stores
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    org_id uuid,
    operator_id uuid,
    name character varying(128) COLLATE pg_catalog."default" NOT NULL,
    root character varying(128) COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    created_by character varying(128) COLLATE pg_catalog."default",
    updated_at timestamp with time zone DEFAULT now(),
    updated_by character varying(128) COLLATE pg_catalog."default",
    CONSTRAINT pkey_store PRIMARY KEY (id),
    CONSTRAINT uq_store_name UNIQUE (org_id, operator_id, name),
    CONSTRAINT uq_store_path UNIQUE (root)
);
ALTER TABLE IF EXISTS service.stores
    OWNER TO ringcontent;
    
-- Table: service.files
-- DROP TABLE service.files;
CREATE TABLE IF NOT EXISTS service.files
(
    guid uuid NOT NULL DEFAULT uuid_generate_v4(),
    file_id character varying(256) COLLATE pg_catalog."default",
    file_name character varying(128) COLLATE pg_catalog."default" NOT NULL,
    file_extension character varying(16) COLLATE pg_catalog."default" NOT NULL,
    size integer NOT NULL DEFAULT 0,
    mimetype character varying(256) COLLATE pg_catalog."default" NOT NULL,
    revision integer DEFAULT 0,
    name character varying(128) COLLATE pg_catalog."default",
    description character varying(256) COLLATE pg_catalog."default",
    store_id uuid NOT NULL,
    store_path character varying(256) COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    created_by character varying(128) COLLATE pg_catalog."default",
    updated_at timestamp with time zone DEFAULT now(),
    updated_by character varying(128) COLLATE pg_catalog."default",
    org_id uuid,
    operator_id uuid,
    CONSTRAINT uq_file_file_id_revision UNIQUE (file_id, revision),
    CONSTRAINT uq_store_file UNIQUE (store_id, store_path, file_name, file_extension, mimetype, revision)
);

ALTER TABLE IF EXISTS service.files 
  DROP CONSTRAINT IF EXISTS fk_storage_id;

ALTER TABLE IF EXISTS service.files
    ADD CONSTRAINT fk_storage_id FOREIGN KEY (store_id)
    REFERENCES service.stores (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;

ALTER TABLE IF EXISTS service.files
    OWNER TO ringcontent;

-- View: service.files_last_revision
-- DROP VIEW service.files_last_revision;
CREATE OR REPLACE VIEW service.files_last_revision
 AS
 WITH maxrevisions AS (
         SELECT files.store_path,
            files.file_id,
            files.file_name,
            max(files.revision) AS max_revision
           FROM service.files
          GROUP BY files.store_path, files.file_id, files.file_name
        )
 SELECT file.guid AS id,
    file.org_id,
    file.operator_id,
    file.file_name,
    file.file_extension,
    file.created_at,
    file.created_by,
    file.updated_at,
    file.updated_by,
    file.store_id,
    file.store_path,
    file.mimetype,
    file.revision,
    file.size,
    file.name,
    file.description,
    file.file_id
   FROM service.files file
     JOIN maxrevisions mr ON file.store_path::text = mr.store_path::text AND file.file_id::text = mr.file_id::text AND file.file_name::text = mr.file_name::text AND file.revision = mr.max_revision
  ORDER BY file.store_id;

ALTER TABLE service.files_last_revision
    OWNER TO ringcontent;

-- FUNCTION: service.search_files_in_store(uuid, text, integer, integer)
-- DROP FUNCTION IF EXISTS service.search_files_in_store(uuid, text, integer, integer);
CREATE OR REPLACE FUNCTION service.search_files_in_store(
	uuid_store uuid,
	match_param text,
	rows_count integer DEFAULT 1000,
	rows_offset integer DEFAULT 0)
    RETURNS SETOF service.files_last_revision 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN
    RETURN QUERY
    SELECT *
    FROM service.files_last_revision
    WHERE (file_name ILIKE '%' || match_param || '%' OR file_name % match_param)
		OR (name ILIKE '%' || match_param || '%'  OR name % match_param)
		OR (description % match_param AND description IS NOT NULL)
	AND store_id = uuid_store
	ORDER BY store_path ASC, file_name ASC, file_extension ASC
	LIMIT rows_count OFFSET rows_offset;
END;
$BODY$;

ALTER FUNCTION service.search_files_in_store(uuid, text, integer, integer)
    OWNER TO ringcontent;
