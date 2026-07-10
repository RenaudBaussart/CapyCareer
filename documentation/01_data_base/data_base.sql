
Table "Roles" {
  "name" VARCHAR(50) [pk]
}

Table "Search_history" {
  "PK_id" INT [pk, increment]
  "search_text" VARCHAR(150) [not null]
}

Table "Job_tags" {
  "name" VARCHAR(100) [pk]
}

Table "User_" {
  "PK_id" INT [pk, increment]
  "email" VARCHAR(100) [not null]
  "username" VARCHAR(50) [not null]
  "hashed_password" VARCHAR(255) [not null]
  "creation_date" DATE [not null]
  "last_connection" DATE [not null]
  "firstname" VARCHAR(50) [not null]
  "lastname" VARCHAR(50) [not null]
  "biography" TEXT
  "profil_pic_link" VARCHAR(500)
  "FK_role_id" VARCHAR(50) [not null]

  Indexes {
    email [unique]
  }
}

Table "Job_Offers" {
  "PK_id" INT [pk, increment]
  "name" VARCHAR(150) [not null]
  "description" TEXT [not null]
  "url" VARCHAR(500) [not null]
  "post_type" VARCHAR(50)
  "FK_user_id" INT
}

Table "Applied" {
  "FK_user_id" INT
  "FK_job_offer_id" INT

  Indexes {
    (FK_user_id, FK_job_offer_id) [pk]
  }
}

Table "Searched" {
  "FK_user_id" INT
  "FK_id_search_history" INT

  Indexes {
    (FK_user_id, FK_id_search_history) [pk]
  }
}

Table "defined" {
  "FK_job_offer_id" INT
  "FK_job_tag_name" VARCHAR(100)

  Indexes {
    (FK_job_offer_id, FK_job_tag_name) [pk]
  }
}

Table "Banned"{
  "PK_banned_id" INT [pk, increment]
  "email" VARCHAR(100) [not null]
}

Ref:"Roles"."name" < "User_"."FK_role_id"

Ref:"User_"."PK_id" < "Job_Offers"."FK_user_id" [delete: set null]

Ref:"User_"."PK_id" < "Applied"."FK_user_id" [delete: cascade]

Ref:"Job_Offers"."PK_id" < "Applied"."FK_job_offer_id" [delete: cascade]

Ref:"User_"."PK_id" < "Searched"."FK_user_id" [delete: cascade]

Ref:"Search_history"."PK_id" < "Searched"."FK_id_search_history" [delete: cascade]

Ref:"Job_Offers"."PK_id" < "defined"."FK_job_offer_id" [delete: cascade]

Ref:"Job_tags"."name" < "defined"."FK_job_tag_name" [delete: cascade]
