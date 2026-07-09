-- table des roles pour les utilisateurs (ex: admin, recruteur, candidat)
CREATE TABLE Roles(
   name VARCHAR(50),
   PRIMARY KEY(name)
);

-- historique global des recherches effectuees sur le site
CREATE TABLE Search_history(
   PK_id INT AUTO_INCREMENT,
   search_text VARCHAR(150) NOT NULL,
   PRIMARY KEY(PK_id)
);

-- liste globale des tags disponibles pour qualifier les offres
CREATE TABLE Job_tags(
   name VARCHAR(100),
   PRIMARY KEY(name)
);

-- table principale des utilisateurs
CREATE TABLE User_(
   PK_id INT AUTO_INCREMENT,
   email VARCHAR(100) NOT NULL,
   username VARCHAR(50) NOT NULL,
   hashed_password VARCHAR(255) NOT NULL,
   creation_date DATE NOT NULL,
   last_connection DATE NOT NULL,
   firstname VARCHAR(50) NOT NULL,
   lastname VARCHAR(50) NOT NULL,
   biography TEXT,
   have_profil_pic BOOLEAN NOT NULL DEFAULT FALSE,
   profil_pic_link VARCHAR(500),
   FK_role_id VARCHAR(50) NOT NULL,
   PRIMARY KEY(PK_id),
   UNIQUE(email),
   FOREIGN KEY(FK_role_id) REFERENCES Roles(name)
);

-- offres d'emploi postees par les recruteurs
CREATE TABLE Job_Offers(
   PK_id INT AUTO_INCREMENT,
   name VARCHAR(150) NOT NULL,
   description TEXT NOT NULL,
   url VARCHAR(500) NOT NULL,
   post_type VARCHAR(50),
   FK_user_id INT, -- mis a null si le recruteur supprime son compte
   PRIMARY KEY(PK_id),
   FOREIGN KEY(FK_user_id) REFERENCES User_(PK_id) ON DELETE SET NULL
);

-- table de jointure pour suivre les candidatures 
CREATE TABLE Applied(
   FK_user_id INT,
   FK_job_offer_id INT,
   PRIMARY KEY(FK_user_id, FK_job_offer_id),
   -- si l'utilisateur ou l'offre disparait, la candidature est supprimee en cascade
   FOREIGN KEY(FK_user_id) REFERENCES User_(PK_id) ON DELETE CASCADE,
   FOREIGN KEY(FK_job_offer_id) REFERENCES Job_Offers(PK_id) ON DELETE CASCADE
);

-- table de jointure reliant les utilisateurs a leur historique de recherche
CREATE TABLE searched(
   FK_user_id INT,
   PK_id_FK_history INT,
   PRIMARY KEY(FK_user_id, PK_id_FK_history),
   FOREIGN KEY(FK_user_id) REFERENCES User_(PK_id) ON DELETE CASCADE,
   FOREIGN KEY(PK_id_FK_history) REFERENCES Search_history(PK_id) ON DELETE CASCADE
);

-- table de jointure reliant les offres d'emploi a leurs mots-cles/tags
CREATE TABLE defined(
   job_offer_id INT,
   name VARCHAR(100),
   PRIMARY KEY(job_offer_id, name),
   -- si l'offre ou le tag est supprime, l'association disparait en cascade
   FOREIGN KEY(job_offer_id) REFERENCES Job_Offers(PK_id) ON DELETE CASCADE,
   FOREIGN KEY(name) REFERENCES Job_tags(name) ON DELETE CASCADE
);