---------------------------------------------------
---------------------------------------------------
---------    CREATE PROPERTYOWNER     -------------
---------------------------------------------------
---------------------------------------------------

CREATE OR REPLACE PROCEDURE procedureInsertPropertyOwner(
    inputUsername character varying, 
    inputPassword character varying, 
    inputemail character varying, 
    inputPhonenumber character varying,
	inputPhonecode character varying,
	InputCountryCode character varying
    )

LANGUAGE plpgsql 
AS $BODY$

	DECLARE 
    nCurrentPropertyOwnerID integer;
	nCurrentPhoneCode integer;
    nCurrentCountryCode integer;

BEGIN
	
	IF EXISTS(
	SELECT tPropertyOwner."cUsername"
   	FROM tPropertyOwner
   	WHERE inputUsername = tPropertyOwner."cUsername"
    )THEN
        RAISE WARNING 'Duplicate username: %', inputUsername; 
		RETURN;
		--USING HINT = 'lsername already in use';
	END IF;

    IF EXISTS(
	SELECT tPropertyOwner."cEmail"
   	FROM tPropertyOwner
   	WHERE inputemail = tPropertyOwner."cEmail"
    )THEN
        RAISE WARNING 'Duplicate email: %', inputemail; 
		RETURN;
		--USING HINT = 'Email already in use';
	END IF;

	-- Check if Phonecode exists
	IF NOT EXISTS( 
	SELECT tPhoneCode."cPhoneCode" 
	FROM tPhoneCode
		WHERE tPhoneCode."cPhoneCode" = InputPhonecode
		) THEN 
		INSERT INTO tPhoneCode("cPhoneCode") 
		VALUES (InputPhonecode);
	END IF;
	
		-- Find Phonecode ID
	SELECT tPhoneCode."nPhoneCodeID"
	INTO nCurrentPhoneCode
	FROM tPhoneCode
	WHERE tPhoneCode."cPhoneCode" = InputPhonecode;

	-- Check if CountryCode exists
	IF NOT EXISTS( 
	SELECT tCountryCode."cCountryCode" 
	FROM tCountryCode
		WHERE tCountryCode."cCountryCode" = InputCountryCode
		) THEN 
		INSERT INTO tCountryCode("cCountryCode") 
		VALUES (InputCountryCode);
	END IF;

	--   Find CountryCode ID
	SELECT tCountryCode."nCountryCodeID"
	INTO nCurrentCountryCode
	FROM tCountryCode
	WHERE tCountryCode."cCountryCode" =  InputCountryCode;

	INSERT INTO tPropertyOwner  
	(
		"cUsername", 
		"cPassword", 
		"cEmail",  
		"cPhoneNumber", 
		"nPhoneCodeID", 
		"nCountryCodeID"
	)
	VALUES 
	(	inputUsername, 
		inputPassword, 
		inputemail, 
		inputPhonenumber,
		nCurrentPhoneCode,
		nCurrentCountryCode
	);

END;
$BODY$