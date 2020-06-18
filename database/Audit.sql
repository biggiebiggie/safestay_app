---------------------------------------------------
---------------------------------------------------
---------    Audit TABLES     --------------------
---------------------------------------------------
---------------------------------------------------

---------------------------------------------------
---------------------------------------------------
---------    INSERTUSER     -----------------------
---------------------------------------------------
---------------------------------------------------

create or replace function auditUserInsert() returns trigger as $auditUserInsert$
begin
insert into tAuditUser
(   
    "cAction",
	"nUserID", 
	"cNewUsername", 
	"cNewPassword", 
	"cNewEmail", 
	"cNewPhoneNumber", 
	"nNewPhoneCodeID", 
	"nNewCountryCodeID", 
	"dJoinDate",
	"timestamp"
)
values
(   
    'I',
	new."nUserID",
	new."cUsername",
	new."cPassword", 
	new."cEmail", 
	new."cPhoneNumber", 
	new."nPhoneCodeID",	
	new."nCountryCodeID",
	CURRENT_DATE,  
	now()
);
return new;
end;
$auditUserInsert$ language plpgsql;


create trigger trgAuditUserInsert after insert on tUser
for each row execute procedure auditUserInsert();

---------------------------------------------------
---------------------------------------------------
---------    UPDATEUSER     -----------------------
---------------------------------------------------
---------------------------------------------------

create or replace function auditUserUpdate() returns trigger as 
$auditUserUpdate$
begin

insert into tAuditUser
( 
    "cAction",
    "nUserID",
    "cOldUsername", 
    "cNewUsername", 
    "cOldPassword", 
    "cNewPassword", 
    "cOldEmail", 
    "cNewEmail", 
    "cOldPhoneNumber", 
    "cNewPhoneNumber", 
    "nOldPhoneCodeID", 
    "nNewPhoneCodeID", 
    "nOldCountryCodeID", 
    "nNewCountryCodeID", 
    "timestamp"
)
values
(	
    'U',
    new."nUserID",
    old."cUsername",
    new."cUsername",
    old."cPassword", 
    new."cPassword", 
    old."cEmail", 
    new."cEmail", 
    old."cPhoneNumber", 
    new."cPhoneNumber", 
    old."nPhoneCodeID",	
    new."nPhoneCodeID",	
    old."nCountryCodeID",  
    new."nCountryCodeID",  
    now()
);
return new;
end;
$auditUserUpdate$ language plpgsql;


create trigger trgAuditUserUpdate after update on tUser
for each row execute procedure auditUserUpdate();
	
---------------------------------------------------
---------------------------------------------------
---------    DELETEUSER     -----------------------
---------------------------------------------------
---------------------------------------------------

create or replace function auditUserDelete() returns trigger as 
$auditUserDelete$
begin

insert into tAuditUser
( 
	"cAction",
	"nUserID",
	"cOldUsername",
	"cOldPassword", 
	"cOldEmail", 
	"cOldPhoneNumber", 
	"nOldPhoneCodeID", 
	"nOldCountryCodeID", 
	"timestamp"
)
values
(	
	'D',
	old."nUserID",
	old."cUsername",
	old."cPassword", 
	old."cEmail", 
	old."cPhoneNumber", 
	old."nPhoneCodeID",	
	old."nCountryCodeID",  
	now()
);
return new;
end;
$auditUserDelete$ language plpgsql;


create trigger trgAuditUserDelete after delete on tUser
for each row execute procedure auditUserDelete();

---------------------------------------------------
---------------------------------------------------
---------    INSERTPROBERTYOWNER     --------------
---------------------------------------------------
---------------------------------------------------

create or replace function auditPropertyOwnerInsert() returns trigger as $auditPropertyOwnerInsert$
begin
insert into tAuditPropertyOwner
(   
"cAction",
"nPropertyOwnerID", 
"cNewUsername", 
"cNewPassword", 
"cNewEmail", 
"cNewPhoneNumber", 
"nNewPhoneCodeID", 
"nNewCountryCodeID", 
"dJoinDate",
"timestamp"
)
values
(   
'I',
new."nPropertyOwnerID",
new."cUsername",
new."cPassword", 
new."cEmail", 
new."cPhoneNumber", 
new."nPhoneCodeID",	
new."nCountryCodeID",
CURRENT_DATE,  
now()
);
return new;
end;
$auditPropertyOwnerInsert$ language plpgsql;


create trigger trgAuditPropertyOwnerInsert after insert on tPropertyOwner
for each row execute procedure auditPropertyOwnerInsert();

---------------------------------------------------
---------------------------------------------------
---------    UPDATEPROBERTYOWNER     --------------
---------------------------------------------------
---------------------------------------------------

create or replace function auditPropertyOwnerUpdate() returns trigger as 
$auditPropertyOwnerUpdate$
begin

insert into tAuditPropertyOwner
( 
	"cAction",
	"nPropertyOwnerID",
	"cOldUsername", 
	"cNewUsername", 
	"cOldPassword", 
	"cNewPassword", 
	"cOldEmail", 
	"cNewEmail", 
	"cOldPhoneNumber", 
	"cNewPhoneNumber", 
	"nOldPhoneCodeID", 
	"nNewPhoneCodeID", 
	"nOldCountryCodeID", 
	"nNewCountryCodeID", 
	"timestamp"
)
values
(	
	'U',
	new."nPropertyOwnerID",
	old."cUsername",
	new."cUsername",
	old."cPassword", 
	new."cPassword", 
	old."cEmail", 
	new."cEmail", 
	old."cPhoneNumber", 
	new."cPhoneNumber", 
	old."nPhoneCodeID",	
	new."nPhoneCodeID",	
	old."nCountryCodeID",  
	new."nCountryCodeID",  
	now()
);
return new;
end;
$auditPropertyOwnerUpdate$ language plpgsql;


create trigger trgAuditPropertyOwnerUpdate after update on tPropertyOwner
for each row execute procedure auditPropertyOwnerUpdate();

---------------------------------------------------
---------------------------------------------------
---------    DELETEPROBERTYOWNER     --------------
---------------------------------------------------
---------------------------------------------------

create or replace function auditPropertyOwnerDelete() returns trigger as $auditPropertyOwnerDelete$
begin
insert into tAuditPropertyOwner
(   
    "cAction",
	"nPropertyOwnerID", 
	"cOldUsername", 
	"cOldPassword", 
	"cOldEmail", 
	"cOldPhoneNumber", 
	"nOldPhoneCodeID", 
	"nOldCountryCodeID", 
	"timestamp"
)
values
(   
    'D',
	old."nPropertyOwnerID",
	old."cUsername",
	old."cPassword", 
	old."cEmail", 
	old."cPhoneNumber", 
	old."nPhoneCodeID",	
	old."nCountryCodeID",
	now()
);
return new;
end;
$auditPropertyOwnerDelete$ language plpgsql;


create trigger trgAditPropertyOwnerDelete after delete on tPropertyOwner
for each row execute procedure auditPropertyOwnerDelete();

---------------------------------------------------
---------------------------------------------------
---------    INSERTPROBERTY     -------------------
---------------------------------------------------
---------------------------------------------------

create or replace function auditPropertyInsert() returns trigger as $auditPropertyInsert$
begin
insert into tAuditProperty
(   
    "cAction",
	"nPropertyOwnerID",
    "cNewTitle",
    "cNewDescription", 
	"nPropertyID", 
	"nTypeID", 
	"nCityID", 
	"cNewAddress",
	"nNewSize",
	"nNewHouseSize",
	"nNewPrice",
	"timestamp"
)
values
(   
    'I',
	new."nPropertyOwnerID",
    new."cTitle",
    new."cDescription", 
	new."nPropertyID",
	new."nTypeID", 
	new."nCityID", 
	new."cAddress",   
	new."nSize",   
	new."nHouseSize",   
	new."nPrice",   
	now()
);
return new;
end;
$auditPropertyInsert$ language plpgsql;


create trigger trgAuditPropertyInsert after insert on tProperty
for each row execute procedure auditPropertyInsert();

---------------------------------------------------
---------------------------------------------------
---------    UPDATEPROBERTY     -------------------
---------------------------------------------------
---------------------------------------------------

create or replace function auditPropertyUpdate() returns trigger as $auditPropertyUpdate$
begin
insert into tAuditProperty
(   
    "cAction",
	"nPropertyOwnerID", 
    "cOldTitle",
    "cNewTitle",
    "cOldDescription", 
    "cNewDescription", 
	"nPropertyID", 
	"nTypeID", 
	"nCityID", 
	"cOldAddress",
	"cNewAddress",
	"nOldSize",
	"nNewSize",
	"nOldHouseSize",
	"nNewHouseSize",
	"nOldPrice",
	"nNewPrice",
	"timestamp"
)
values
(   
    'U',
	new."nPropertyOwnerID",
    old."cTitle",
    new."cTitle",
    old."cDescription", 
    new."cDescription", 
	new."nPropertyID",
	new."nTypeID", 
	new."nCityID", 
	old."cAddress",   
	new."cAddress",   
	old."nSize",   
	new."nSize",   
	old."nHouseSize",   
	new."nHouseSize",   
	old."nPrice",   
	new."nPrice",   
	now()
);
return new;
end;
$auditPropertyUpdate$ language plpgsql;


create trigger trgAuditPropertyUpdate after update on tProperty
for each row execute procedure auditPropertyUpdate();

---------------------------------------------------
---------------------------------------------------
---------    DELETEPROBERTY     -------------------
---------------------------------------------------
---------------------------------------------------

create or replace function auditPropertyDelete() returns trigger as $auditPropertyDelete$
begin
insert into tAuditProperty
(   
    "cAction",
	"nPropertyOwnerID", 
	"nPropertyID", 
	"nTypeID", 
	"nCityID", 
	"cOldAddress",
	"nOldSize",
	"nOldHouseSize",
	"nOldPrice",
	"timestamp"
)
values
(   
    'D',
	old."nPropertyOwnerID",
	old."nPropertyID",
	old."nTypeID", 
	old."nCityID", 
	old."cAddress",   
	old."nSize",   
	old."nHouseSize",   
	old."nPrice",   
	now()
);
return new;
end;
$auditPropertyDelete$ language plpgsql;


create trigger trgAuditPropertyDelete after delete on tProperty
for each row execute procedure auditPropertyDelete();

---------------------------------------------------
---------------------------------------------------
---------    INSERTCREDITCARD     -----------------
---------------------------------------------------
---------------------------------------------------

create or replace function auditCreditcardInsert() returns trigger as $auditCreditcardInsert$
begin
insert into tAuditCreditcard
(   
    "cAction",
	"nCreditcardID", 
	"cNewIBANcode", 
	"cNewCVV", 
	"cNewExpirationDate", 
	"nUserID", 
	"timestamp"
)
values
(   
    'I',
	new."nCreditcardID",
	new."cIBANcode",
	new."cCVV", 
	new."cExpirationDate", 
	new."nUserID",   
	now()
);
return new;
end;
$auditCreditcardInsert$ language plpgsql;


create trigger trgAuditCreditcardInsert after insert on tCreditcard
for each row execute procedure auditCreditcardInsert();

---------------------------------------------------
---------------------------------------------------
---------    UPDATECREDITCARD     -----------------
---------------------------------------------------
---------------------------------------------------
	
create or replace function auditCreditcardUpdate() returns trigger as $creditcardAuditUpdate$
begin
insert into tAuditCreditcard
( 
    "cAction",
    "nCreditcardID",
    "cOldIBANcode",
    "cNewIBANcode",
    "nOldCVV",
    "nNewCVV",
    "nOldExpirationDate",
    "nNewExpirationDate",
    "nUserID",
    "timestamp"
)
values
(	
    'U',
    new."nCreditcardID",
    old."cOldIBANcode",
    new."cNewIBANcode",
    old."nOldCVV", 
    new."nNewCVV", 
    old."nOldExpirationDate", 
    new."nNewExpirationDate", 
    new."nUserID",   
    now()
);
return new;
end;
$creditcardAuditUpdate$ language plpgsql;


create trigger trgAuditUserUpdate after update on tCreditcard
for each row execute procedure auditCreditcardUpdate();

---------------------------------------------------
---------------------------------------------------
---------    DELETECREDITCARD     -----------------
---------------------------------------------------
---------------------------------------------------

create or replace function auditCreditcardDelete() returns trigger as 
$auditCreditcardDelete$
begin

insert into tAuditCreditcard
( 
	"cAction",
	"nCreditcardID",
	"cOldIBANcode",
	"nOldCVV",
	"nOldExpirationDate",
	"nUserID",
	"timestamp"
)
values
(	
	'D',
	old."nCreditcardID",
	old."cIBANcode",
	old."nCVV", 
	old."nExpirationDate", 
	old."nUserID",  
	now()
);
return new;
end;
$auditCreditcardDelete$ language plpgsql;


create trigger trgAuditCreditcardDelete after delete on tCreditcard
for each row execute procedure auditCreditcardDelete();

---------------------------------------------------
---------------------------------------------------
---------    INSERTRENTED     ---------------------
---------------------------------------------------
---------------------------------------------------

create or replace function auditRentedInsert() returns trigger as $auditRentedInsert$
begin
insert into tAuditRented
(   
    "cAction",
	"nRentID", 
	"nUserID",
	"nPropertyID",
	"dStart",
	"dEnd",
	"timestamp"
)
values
(   
    'I',
	new."nRentID", 
	new."nUserID",
	new."nPropertyID",
	new."dStart",
	new."dEnd", 
	now()
);
return new;
end;
$auditRentedInsert$ language plpgsql;


create trigger trgAuditRentedInsert after insert on tRented
for each row execute procedure auditRentedInsert();
	
---------------------------------------------------
---------------------------------------------------
---------    DELETERENTED     ---------------------
---------------------------------------------------
---------------------------------------------------

create or replace function auditRentedDelete() returns trigger as $auditRentedDelete$
begin
insert into tAuditRented
(   
    "cAction",
	"nRentID", 
	"nUserID",
	"nPropertyID",
	"dStart",
	"dEnd",
	"timestamp"
)
values
(   
    'D',
	old."nRentID", 
	old."nUserID",
	old."nPropertyID",
	old."dStart",
	old."dEnd", 
	now()
);
return new;
end;
$auditRentedDelete$ language plpgsql;


create trigger trgAuditRentedDelete after delete on tRented
for each row execute procedure auditRentedDelete();

---------------------------------------------------
---------------------------------------------------
---------    INSERTPAYMENT     --------------------
---------------------------------------------------
---------------------------------------------------

create or replace function auditPaymentInsert() returns trigger as $auditPaymentInsert$
begin
insert into tAuditPayment
(   
    "cAction",
	"nCreditcardID", 
	"nRentID",
	"nNewValue",
	"timestamp"
)
values
(   
    'I',
	new."nCreditcardID", 
	new."nRentID",
	new."nValue", 
	now()
);
return new;
end;
$auditPaymentInsert$ language plpgsql;


create trigger trgAuditPaymentInsert after insert on tPayment
for each row execute procedure auditPaymentInsert();

---------------------------------------------------
---------------------------------------------------
---------    UPDATEPAYMENT     --------------------
---------------------------------------------------
---------------------------------------------------

create or replace function auditPaymentUpdate() returns trigger as $auditPaymentUpdate$
begin
insert into tAuditPayment
(   
    "cAction",
	"nCreditcardID", 
	"nRentID",
	"nOldValue",
	"nNewValue",
	"timestamp"
)
values
(   
    'U',
	new."nCreditcardID", 
	new."nRentID",
	old."nValue", 
	new."nValue", 
	now()
);
return new;
end;
$auditPaymentUpdate$ language plpgsql;


create trigger trgAuditPaymentUpdate after update on tPayment
for each row execute procedure auditPaymentUpdate();

---------------------------------------------------
---------------------------------------------------
---------    DELETEPAYMENT     --------------------
---------------------------------------------------
---------------------------------------------------

create or replace function auditPaymentDelete() returns trigger as $auditPaymentDelete$
begin
insert into tAuditPayment
(   
    "cAction",
	"nCreditcardID", 
	"nRentID",
	"nOldValue",
	"timestamp"
)
values
(   
    'D',
	old."nCreditcardID", 
	old."nRentID",
	old."nValue",  
	now()
);
return new;
end;
$auditPaymentDelete$ language plpgsql;


create trigger trgAuditPaymentDelete after delete on tPayment
for each row execute procedure auditPaymentDelete();

---------------------------------------------------
---------------------------------------------------
---------    INSERTFACILITY     -------------------
---------------------------------------------------
---------------------------------------------------

create or replace function auditFacilityInsert() returns trigger as $auditFacilityInsert$
begin
insert into tAuditFacility
(   
    "cAction",
	"nFacilityID", 
	"nPropertyID",
	"bNewEthernet",
	"bNewAnimals",
	"bNewFamilyFriendly",
	"timestamp"
)
values
(   
    'I',
	new."nFacilityID", 
	new."nPropertyID",
	new."bEthernet",
	new."bAnimals",
	new."bFamilyFriendly",  
	now()
);
return new;
end;
$auditFacilityInsert$ language plpgsql;


create trigger trgAuditFacilityInsert after insert on tFacility
for each row execute procedure auditFacilityInsert();

---------------------------------------------------
---------------------------------------------------
---------    UPDATEFACILITY     -------------------
---------------------------------------------------
---------------------------------------------------

create or replace function auditFacilityUpdate() returns trigger as $auditFacilityUpdate$
begin
insert into tAuditFacility
(   
    "cAction",
	"nFacilityID", 
	"nPropertyID",
	"bOldEthernet",
	"bNewEthernet",
	"bOldAnimals",
	"bNewAnimals",
	"bOldFamilyFriendly",
	"bNewFamilyFriendly",
	"timestamp"
)
values
(   
    'U',
	new."nFacilityID", 
	new."nPropertyID",
	old."bEthernet",
	new."bEthernet",
	old."bAnimals",
	new."bAnimals",
	old."bFamilyFriendly",  
	new."bFamilyFriendly",  
	now()
);
return new;
end;
$auditFacilityUpdate$ language plpgsql;


create trigger trgAuditFacilityUpdate after update on tFacility
for each row execute procedure auditFacilityUpdate();

---------------------------------------------------
---------------------------------------------------
---------    DELETEFACILITY     -------------------
---------------------------------------------------
---------------------------------------------------

create or replace function auditFacilityDelete() returns trigger as $auditFacilityDelete$
begin
insert into tAuditFacility
(   
    "cAction",
	"nFacilityID", 
	"nPropertyID",
	"bOldEthernet",
	"bOldAnimals",
	"bOldFamilyFriendly",
	"timestamp"
)
values
(   
    'D',
	old."nFacilityID", 
	old."nPropertyID",
	old."bEthernet",
	old."bAnimals",
	old."bFamilyFriendly", 
	now()
);
return new;
end;
$auditFacilityDelete$ language plpgsql;


create trigger trgAuditFacilityDelete after delete on tFacility
for each row execute procedure auditFacilityDelete();

---------------------------------------------------
---------------------------------------------------
---------    INSERTPROPERTYIMAGE     --------------
---------------------------------------------------
---------------------------------------------------

create or replace function auditPropertyImageInsert() returns trigger as $auditPropertyImageInsert$
begin
insert into tAuditPropertyImage
(   
    "cAction",
	"nImageID", 
	"nPropertyID",
	"byteaNewImage",
	"timestamp"
)
values
(   
    'I',
	new."nImageID", 
	new."nPropertyID",
	new."byteaImage",  
	now()
);
return new;
end;
$auditPropertyImageInsert$ language plpgsql;


create trigger trgAuditPropertyImageInsert after insert on tPropertyImage
for each row execute procedure auditPropertyImageInsert();

---------------------------------------------------
---------------------------------------------------
---------    UPDATEPROPERTYIMAGE     --------------
---------------------------------------------------
---------------------------------------------------

create or replace function auditPropertyImageUpdate() returns trigger as $auditPropertyImageUpdate$
begin
insert into tAuditPropertyImage
(   
    "cAction",
	"nImageID", 
	"nPropertyID",
	"byteaOldImage",
	"byteaNewImage",
	"timestamp"
)
values
(   
    'U',
	new."nImageID", 
	new."nPropertyID",
	old."byteaImage",
	new."byteaImage",  
	now()
);
return new;
end;
$auditPropertyImageUpdate$ language plpgsql;


create trigger trgAuditPropertyImageUpdate after update on tPropertyImage
for each row execute procedure auditPropertyImageUpdate();

---------------------------------------------------
---------------------------------------------------
---------    DELETEPROPERTYIMAGE     --------------
---------------------------------------------------
---------------------------------------------------

create or replace function auditPropertyImageDelete() returns trigger as $auditPropertyImageDelete$
begin
insert into tAuditPropertyImage
(   
    "cAction",
	"nImageID", 
	"nPropertyID",
	"byteaOldImage",
	"timestamp"
)
values
(   
    'D',
	old."nImageID", 
	old."nPropertyID",
	old."byteaImage",
	now()
);
return new;
end;
$auditPropertyImageDelete$ language plpgsql;


create trigger trgAuditPropertyImageDelete after delete on tPropertyImage
for each row execute procedure auditPropertyImageDelete();
