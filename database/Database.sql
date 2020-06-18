-- 1. tPhoneCode
-- 2. tCountryCode
-- 3. tCity
-- 4. tUser
-- 5. tPropertyType
-- 6. tPropertyOwner
-- 7. tProperty
-- 8. tFacility
-- 9. tPropertyImage
-- 10. tRented
-- 11. tCreditcard
-- 12. tPayment

CREATE TABLE tPhoneCode
(
    "nPhoneCodeID" serial PRIMARY KEY,
    "cPhoneCode" varchar(20)
);

CREATE TABLE tCountryCode
(
    "nCountryCodeID" serial PRIMARY KEY,
    "cCountryCode" varchar(20)
);

CREATE TABLE tCity
(
    "nCityID" serial PRIMARY KEY,
    "cCityName" varchar(50),
    "cZipcode" varchar(50)
);

CREATE TABLE tUser
(
    "nUserID" serial PRIMARY KEY,
    "cUsername" varchar(50),
    "cPassword" varchar(50),
    "cEmail" varchar(350),
    "cPhoneNumber" varchar(20),
    "dJoinDate" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "nPhoneCodeID" serial REFERENCES tPhoneCode("nPhoneCodeID"),
    "nCountryCodeID" serial REFERENCES tCountryCode("nCountryCodeID")
);

CREATE TABLE tPropertyType
(
    "nTypeID" serial PRIMARY KEY,
    "cPropertyType" varchar(50)
);

CREATE TABLE tPropertyOwner
(
    "nPropertyOwnerID" serial PRIMARY KEY,
    "cUsername" varchar(50),
    "cPassword" varchar(50),
    "cEmail" varchar(350),
    "cPhoneNumber" varchar(20),
    "dJoinDate" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "nPhoneCodeID" serial REFERENCES tPhoneCode("nPhoneCodeID"),
    "nCountryCodeID" serial REFERENCES tCountryCode("nCountryCodeID")
);

CREATE TABLE tProperty
(
    "nPropertyID" serial PRIMARY KEY,
	"nPropertyOwnerID" serial REFERENCES tPropertyOwner("nPropertyOwnerID"),
    "cTitle" varchar(100),
    "cDescription" varchar(1000),
    "nPrice" integer,
    "nTypeID" serial REFERENCES tPropertyType ("nTypeID"),
    "nCityID" serial REFERENCES tCity ("nCityID"),
    "cAddress" varchar(150),
    "nSize" integer,
    "nHouseSize" integer
);

CREATE TABLE tFacility
(
    "nFacilityID" serial PRIMARY KEY,
    "nPropertyID" serial REFERENCES tProperty ("nPropertyID"),
    "bEthernet" boolean,
    "bAnimals" boolean,
    "bFamilyFriendly" boolean
);

CREATE TABLE tPropertyImage
(
    "nImageID" serial PRIMARY KEY,
    "nPropertyID" serial REFERENCES tProperty ("nPropertyID"),
    "byteaImage" varchar(300)
);

CREATE TABLE tRented
(
    "nRentID" serial PRIMARY KEY,
    "nUserID" serial REFERENCES tUser ("nUserID"),
    "nPropertyID" serial REFERENCES tProperty ("nPropertyID"),
    "dStart" date,
    "dEnd" date
);

CREATE TABLE tCreditcard
(
    "nCreditcardID" serial PRIMARY KEY,
    "cIBANcode" varchar (32),
    "cCVV" char (3),
    "cExpirationDate" char (4),
    "nUserID" serial REFERENCES tUser ("nUserID")
);

CREATE TABLE tPayment
(
    "nCreditcardID" serial REFERENCES tCreditcard ("nCreditcardID"),
    "nRentID" serial REFERENCES tRented ("nRentID"),
    "nValue" integer,
    "dTimestamp" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("nCreditcardID", "nRentID")
);

-- ////////////////////////////////   Audit Tables   \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ --
-- ////////////////////////////////   Audit Tables   \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ --
-- ////////////////////////////////   Audit Tables   \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ --
-- ////////////////////////////////   Audit Tables   \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ --
-- ////////////////////////////////   Audit Tables   \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ --
-- ////////////////////////////////   Audit Tables   \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ --
-- ////////////////////////////////   Audit Tables   \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ --

CREATE TABLE tAuditUser
(
    "nAuditUserID" serial PRIMARY KEY,
    "cAction" char(1),
    "nUserID" integer,
    "cOldUsername" varchar(50),
    "cNewUsername" varchar(50),
    "cOldPassword" varchar(50),
    "cNewPassword" varchar(50),
    "cOldEmail" varchar(350),
    "cNewEmail" varchar(350),
    "cOldPhoneNumber" varchar(20),
    "cNewPhoneNumber" varchar(20),
    "nOldPhoneCodeID" integer,
    "nNewPhoneCodeID" integer,
    "nOldCountryCodeID" integer,
    "nNewCountryCodeID" integer,
    "dJoinDate" date, 
    "timestamp" date
);

CREATE TABLE tAuditPropertyOwner
(
    "nAuditPropertyOwnerID" serial PRIMARY KEY,
    "cAction" char(1),
    "nPropertyOwnerID" integer,
    "cOldUsername" varchar(50),
    "cNewUsername" varchar(50),
    "cOldPassword" varchar(50),
    "cNewPassword" varchar(50),
    "cOldEmail" varchar(350),
    "cNewEmail" varchar(350),
    "cOldPhoneNumber" varchar(20),
    "cNewPhoneNumber" varchar(20),
    "nOldPhoneCodeID" integer,
    "nNewPhoneCodeID" integer,
    "nOldCountryCodeID" integer,
    "nNewCountryCodeID" integer,
    "dJoinDate" date, 
    "timestamp" date
);

CREATE TABLE tAuditProperty
(
    "nAuditPropertyID" serial PRIMARY KEY,
    "cAction" char(1),
    "nPropertyOwnerID" integer,
    "cOldTitle" varchar(100),
    "cNewTitle" varchar(100),
    "cOldDescription" varchar(1000),
    "cNewDescription" varchar(1000),
	"nPropertyID" integer,
    "nTypeID" integer,
    "nCityID" integer,
    "cOldAddress" varchar(150),
    "cNewAddress" varchar(150),
    "nOldSize" integer,
    "nNewSize" integer,
    "nOldHouseSize" integer,
    "nNewHouseSize" integer,
    "nOldPrice" integer,
    "nNewPrice" integer, 
    "timestamp" date
);

CREATE TABLE tAuditFacility
(
    "nAuditFacilityID" serial PRIMARY KEY,
    "cAction" char(1),
    "nFacilityID" integer,
    "nPropertyID" integer,
    "bOldEthernet" boolean,
    "bNewEthernet" boolean,
    "bOldAnimals" boolean,
    "bNewAnimals" boolean,
    "bOldFamilyFriendly" boolean,
    "bNewFamilyFriendly" boolean, 
    "timestamp" date
);

CREATE TABLE tAuditPropertyImage
(   
    "tAuditPropertyImageID" serial PRIMARY KEY,
    "cAction" char(1),
    "nImageID" integer,
    "nPropertyID" integer,
    "byteaOldImage" varchar(300),
    "byteaNewImage" varchar(300), 
    "timestamp" date
);

CREATE TABLE tAuditRented
(
    "nAuditRentedID" serial PRIMARY KEY,
    "cAction" char(1),
    "nRentID" integer,
    "nUserID" integer,
    "nPropertyID" integer,
    "dStart" date,
    "dEnd" date, 
    "timestamp" date
);

CREATE TABLE tAuditCreditcard
(
    "nAuditCreditcardID" serial PRIMARY KEY,
    "cAction" char(1),
    "nCreditcardID" integer,
    "cOldIBANcode" varchar (32),
    "cNewIBANcode" varchar (32),
    "cOldCVV" char (3),
    "cNewCVV" char (3),
    "cOldExpirationDate" char (4),
    "cNewExpirationDate" char (4),
    "nUserID" integer, 
    "timestamp" date
);

CREATE TABLE tAuditPayment
(
    "nAuditPaymentID" serial PRIMARY KEY,
    "cAction" char(1),
    "nCreditcardID" integer,
    "nRentID" integer,
    "nOldValue" integer,
    "nNewValue" integer, 
    "timestamp" date
);