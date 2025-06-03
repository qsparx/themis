create table "public"."todos" (
    "id" character varying not null,
    "title" character varying not null,
    "description" character varying not null,
    "done" boolean not null,
    "updatedAt" bigint not null,
    "replicationRevision" character varying not null,
    "deleted" boolean not null
);


CREATE UNIQUE INDEX todos_pkey ON public.todos USING btree (title);

alter table "public"."todos" add constraint "todos_pkey" PRIMARY KEY using index "todos_pkey";

grant delete on table "public"."todos" to "anon";

grant insert on table "public"."todos" to "anon";

grant references on table "public"."todos" to "anon";

grant select on table "public"."todos" to "anon";

grant trigger on table "public"."todos" to "anon";

grant truncate on table "public"."todos" to "anon";

grant update on table "public"."todos" to "anon";

grant delete on table "public"."todos" to "authenticated";

grant insert on table "public"."todos" to "authenticated";

grant references on table "public"."todos" to "authenticated";

grant select on table "public"."todos" to "authenticated";

grant trigger on table "public"."todos" to "authenticated";

grant truncate on table "public"."todos" to "authenticated";

grant update on table "public"."todos" to "authenticated";

grant delete on table "public"."todos" to "service_role";

grant insert on table "public"."todos" to "service_role";

grant references on table "public"."todos" to "service_role";

grant select on table "public"."todos" to "service_role";

grant trigger on table "public"."todos" to "service_role";

grant truncate on table "public"."todos" to "service_role";

grant update on table "public"."todos" to "service_role";

-- add a table to the publication
alter publication supabase_realtime add table "public"."todos";