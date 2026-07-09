
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

Table "searched" {
  "FK_user_id" INT
  "PK_id_FK_history" INT

  Indexes {
    (FK_user_id, PK_id_FK_history) [pk]
  }
}

Table "defined" {
  "job_offer_id" INT
  "job_tag_name" VARCHAR(100)

  Indexes {
    (job_offer_id, job_tag_name) [pk]
  }
}

Ref:"Roles"."name" < "User_"."FK_role_id"

Ref:"User_"."PK_id" < "Job_Offers"."FK_user_id" [delete: set null]

Ref:"User_"."PK_id" < "Applied"."FK_user_id" [delete: cascade]

Ref:"Job_Offers"."PK_id" < "Applied"."FK_job_offer_id" [delete: cascade]

Ref:"User_"."PK_id" < "searched"."FK_user_id" [delete: cascade]

Ref:"Search_history"."PK_id" < "searched"."PK_id_FK_history" [delete: cascade]

Ref:"Job_Offers"."PK_id" < "defined"."job_offer_id" [delete: cascade]

Ref:"Job_tags"."name" < "defined"."job_tag_name" [delete: cascade]
