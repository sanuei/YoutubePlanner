-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.categories (
  category_id bigint NOT NULL DEFAULT nextval('categories_category_id_seq'::regclass),
  category_name character varying NOT NULL,
  user_id bigint NOT NULL,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT categories_pkey PRIMARY KEY (category_id),
  CONSTRAINT categories_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id)
);
CREATE TABLE public.channels (
  channel_id bigint NOT NULL DEFAULT nextval('channels_channel_id_seq'::regclass),
  channel_name character varying NOT NULL,
  created_at timestamp with time zone NOT NULL,
  deleted boolean NOT NULL,
  user_id bigint NOT NULL,
  CONSTRAINT channels_pkey PRIMARY KEY (channel_id),
  CONSTRAINT channels_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id)
);
CREATE TABLE public.script_chapters (
  chapter_id bigint NOT NULL DEFAULT nextval('script_chapters_chapter_id_seq'::regclass),
  script_id bigint NOT NULL,
  chapter_number integer NOT NULL,
  title character varying,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT script_chapters_pkey PRIMARY KEY (chapter_id),
  CONSTRAINT script_chapters_script_id_fkey FOREIGN KEY (script_id) REFERENCES public.scripts(script_id)
);
CREATE TABLE public.scripts (
  script_id bigint NOT NULL DEFAULT nextval('scripts_script_id_seq'::regclass),
  title character varying NOT NULL,
  alternative_title1 character varying,
  description text,
  difficulty integer,
  status character varying,
  release_date date,
  user_id bigint NOT NULL,
  channel_id bigint,
  category_id bigint,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT scripts_pkey PRIMARY KEY (script_id),
  CONSTRAINT scripts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id),
  CONSTRAINT scripts_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(category_id)
);
CREATE TABLE public.users (
  user_id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  username character varying NOT NULL UNIQUE,
  password_hash character varying NOT NULL,
  email character varying UNIQUE,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  avatar_url character varying,
  display_name character varying,
  CONSTRAINT users_pkey PRIMARY KEY (user_id)
);